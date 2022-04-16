import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Tooltip from '@mui/material/Tooltip';
import EditRoadRoundedIcon from '@mui/icons-material/EditRoadRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from "@emotion/react";
import { CssBaseline, useMediaQuery } from "@mui/material";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AddLessonForm from '../../../../components/forms/AddLessonForm';
import { toast } from "react-toastify";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import UnpublishedOutlinedIcon from '@mui/icons-material/UnpublishedOutlined';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;
  
    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };

  
const CourseView = () => {

    const theme = useTheme();
    const matchesMD = useMediaQuery(theme.breakpoints.down('md'));

    const [course, setCourse] = useState({});

    // for lessons
    const [visible, setVisible] = useState(false);
    const [values, setValues] = useState({
        title: '',
        content: '',
        video: {},
    });

    const [uploadButtonText, setUploadButtonText] = useState("Upload Video");
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusDialog, setStatusDialog] = useState({open: false, eventTitle: '', status: '', btnTitle: ''});
    const [students, setStudents] = useState(0);
    


    const router = useRouter();

    const { slug } = router.query;


    useEffect(() => {
        // console.log(slug);
        loadCourse();
    }, [slug]);

    useEffect(() => {
        course && studentCount()
    }, [course]);

    const loadCourse = async () => {
        if(!slug) return;
        const {data} = await axios.get(`/api/user/course/${slug}`);
        setCourse(data);
        if(data && data.video && data.video.Location) setPreview(true);
    };
    const studentCount = async () => {
        const {data} = await axios.post('/api/instructor/student-count', {
            courseId: course._id
        });
        console.log("STUDENT COUNT => ", data);
        setStudents(data.length);
    };

    // FUNCTIONS for LESSONS

    const handleAddLesson = async (e) => {
        e.preventDefault();
        // console.log(values);
        try {
            const {data} = await axios.post(`/api/course/lesson/${slug}/${course.instructor._id}`,
            values
           );
        //    console.log(data);

        if(data && data.ok) {
            setValues({ ...values, title: '', content: "", video: ""});
            setVisible(false);
            setProgress(0);
            setUploading(false);
            setUploadButtonText('Upload video');
            setPreview(false);
            data.ok = undefined;
            loadCourse();
            toast.success('Lesson Added successfully');
        } else {
            toast('Failed. Try Again');
        }
        } catch(err) {
            console.log(err);
            toast.error('Lesson add Failed. Try Again');
        }        
        
    };


    const handleChange = (e) => {
       
        setValues({ ...values, [e.target.name]: e.target.value })
    };

    const handleVideo = async (e) => {
    //    console.log(course);
    //    return;
        try {
            const file = e.target.files[0];
            if(!file) return;
            setUploadButtonText(file.name);
            setUploading(true);
            const videoData = new FormData();
            videoData.append('video', file);

            // save progress bar and send video as form data to backend
            const {data} = await axios.post(`/api/course/video-upload/${course.instructor._id}`, videoData, {
                onUploadProgress: (e) => {
                    setProgress(Math.round((100 * e.loaded) / e.total));
                }
            });

            // once response is recieved
            setValues({...values, video: data});

            // console.log(data);
            setPreview(true);
            setUploading(false);
            toast.success('Video uploaded Successfully, Please Save Your Lesson.');
        } catch(err) {
            console.log(err);
            setUploading(false);
            setUploadButtonText('Upload video');
            toast.error("Video upload failed");
        }


    };

    const handleVideoRemove = async () => {
        // e.preventDefault();
        setUploading(true);
        
        try {
            const res = await axios.post(`/api/course/video-remove/${course.instructor._id}`, {video: values.video});
            setValues({...values, video: {}});
            setPreview(false);
            setProgress(0);
            setUploadButtonText('Upload another video');
            setUploading(false);
        } catch(err) {
            setUploading(false);
            console.log(err);
            toast.error('Video Remove Failed');
        }
    }

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      }
      
    const getFormatedUpdateDate = (d) => {
        let date = new Date(d);
        // console.log(date, typeof date);
        // console.log(date.getFullYear(), typeof date.getFullYear);

        let dateFormat = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDay();

        
        return dateFormat + ' ' + formatAMPM(date); 
    };


    const handlePublish = async (e, courseId) => {
        setStatusDialog(
            {
                open: true, 
                eventTitle: 'Once you publish your course, it will be live in the marketplace for users to enroll', 
                status: 'publish',
                btnTitle: 'Publish'
            }
        );

        
    };

    const handleUnPublish = (e, courseId) => {
        setStatusDialog(
            {
                open: true, 
                eventTitle: 'Once you unpublish your course, it will not be available for users to enroll', 
                status: 'unpublish',
                btnTitle: 'UnPublish'
            }
        );

    };

    const ChangeStatus = async (status='unpublish', courseId) => {
        const {data} = await axios.put('/api/course/'+status+'/'+courseId)
        // console.log(status);
        if(data.ok) {
            if(status == 'publish') {
                toast('Congrats. Your couse is live');
            } else {
                toast('Your couse is not live');
            }
            setCourse({...course, published: data.published});
        } else {
            toast.error('Update course status failed');
        }
        setStatusDialog({...statusDialog, open: false});
    }

    return (
        <InstructorRoute>
            <Grid  container direction="column" >
                <Grid item container  paddingTop={4} justifyContent="center">
                   
                   
                   {course && Object.keys(course).length > 0 && <>
                   <Grid item container direction="row" justifyContent="space-between">
                        <Grid item>
                                <Avatar sx={{width: 70, height: 70}} src={course.image ? course.image.Location : '/course.png'} />
                            </Grid>
                            <Grid item sx={{maxWidth: "57.5%"}}>
                                <Typography color="primary" variant="h4" component="h1"> {course.title} </Typography>
                                
                                <Typography color="primary" variant="body1"> {course.lessons.length } Lessons </Typography>
                                <Typography variant="body2" sx={{marginRight: '-10px'}}> {course.description } </Typography>
                            </Grid>


                            <Grid item sx={{flexGrow: .4, paddingTop: '.65rem'}}>
                                <Grid item container justifyContent="space-evenly">
                                <Tooltip title={`${students} students`}>
                                        <SupervisedUserCircleIcon color="black" 
                                        />
                                    </Tooltip>
                                    <Tooltip title="Edit">
                                        <EditRoadRoundedIcon color="primary" 
                                            onClick={() => router.push(`/instructor/course/edit/${slug}`)} 
                                        />
                                    </Tooltip>
                                    {course.lessons && course.lessons.length < 5 ? (<Tooltip title="Min 5 lessons required ro publish">
                                        <HelpOutlineIcon color="warning" 
                                        
                                        />
                                    </Tooltip>) : course.published ? (<Tooltip title="Unpublish">
                                        <UnpublishedOutlinedIcon color="warning"
                                            onClick={(e) => handleUnPublish(e, course._id)} 
                                        
                                        />
                                    </Tooltip>) : (<Tooltip title="Publish">
                                        <CheckRoundedIcon color="success"
                                            onClick={(e) => handlePublish(e, course._id)}  
                                        
                                        />
                                    </Tooltip>)}
                                    
                                </Grid>
                                <Grid item justifyContent="space-evenly" sx={{paddingTop: '1.7rem'}}>                          
                                    <Button variant="outlined"   onClick={() => setVisible(true)}  color="primary" startIcon={<AddOutlinedIcon />}>Add Lesson </Button>
                                    <Dialog
                                        maxWidth="10"
                                        onClose={() => setVisible(false)}
                                        aria-labelledby="customized-dialog-title"
                                        open={visible}
                                        >
                                        <BootstrapDialogTitle id="customized-dialog-title" onClose={() => setVisible(false)}>
                                            + Add Lesson
                                        </BootstrapDialogTitle>
                                        <DialogContent dividers>
                                            <AddLessonForm values={values} setValues={setValues}
                                                handleAddLesson={handleAddLesson}
                                                handleChange={handleChange}
                                                uploadButtonText={uploadButtonText}
                                                handleVideo={handleVideo}
                                                handleVideoRemove={handleVideoRemove}
                                                preview={preview}
                                                uploading={uploading}
                                                progress={progress}
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                        <Button onClick={() => setVisible(false)}>
                                            Close
                                        </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Grid>
                            </Grid>
                       
                       </Grid>
                       <Grid item container direction="column" justifyContent="space-between">
                       <List dense={true}>
                       {/* {JSON.stringify(course.lessons[0], null, 4)} */}

                           {course && course.lessons && course.lessons.length > 0 && <>
                           
                            {
                                course.lessons.map((item, index) => (
                                    <ListItem
                                        key={item.slug+'-'+index}
                                    // secondaryAction={
                                    //     <IconButton edge="end" aria-label="delete">
                                    //     <DeleteIcon />
                                    //     </IconButton>
                                    // }
                                    >
                                    <ListItemAvatar>
                                        <Avatar>
                                            {index+1}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={item.title}
                                        secondary={'Last Update: '+getFormatedUpdateDate(item.updatedAt)}
                                    />
                                    </ListItem>
                                ))
                            }
                           </>

                           }
                        </List>
                        </Grid>
                       </>}
                   
                   
                    {/* <pre>
                        {JSON.stringify(course, null, 4)}
                    </pre> */}
                </Grid>
            </Grid>

{/* ASK to COnfrim  */}
                                        
        {course && Object.keys(course).length > 0 && <Dialog
            open={statusDialog.open}
            onClose={() => setStatusDialog({...statusDialog, open: false})}
            aria-labelledby="responsive-dialog-title"
            >
            <DialogTitle id="responsive-dialog-title">
            {"Are you sure to delete this item ?"}
            </DialogTitle>
            <DialogContent sx={{display: "flex", flexDirection: "column"}}>

            <DialogContentText sx={{maxWidth: "70%", padding: "4px 0 0 5px"}}>
                <Avatar src={course && course.image && course.image.Location ? course.image.Location : '/course.png'}></Avatar>

                    {course.title}

            </DialogContentText>
            
            <DialogContentText sx={{width: "100%", padding: "4px 0 0 25px", textAlign: "center"}}>

                {statusDialog.eventTitle}

            </DialogContentText>

            </DialogContent>
            <DialogActions>
            <Button autoFocus sx={{color: "#8499d5"}} onClick={() => setStatusDialog({...statusDialog, open: false})}>
                Cancel
            </Button>
            <Button onClick={() => ChangeStatus(statusDialog.status, course._id)} autoFocus>
                {statusDialog.btnTitle}
            </Button>
            </DialogActions>
        </Dialog>  }


        </InstructorRoute>
    )


}

export default CourseView;