import { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../../../../components/ui/Hero';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import { Divider, Grid, Typography } from '@mui/material';
import CourseCreateForm from '../../../../components/forms/CourseCreateForm';
import Resizer from 'react-image-file-resizer';
import {toast} from 'react-toastify';
import { useRouter } from 'next/router';
import Avatar from "@mui/material/Avatar";
import IconButton from '@mui/material/IconButton';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import { typographyVariant } from '@mui/system';
import UpdateLessonForm from '../../../../components/forms/UpdateLessonForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

const CourseEdit = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [values, setValues] = useState({
        title: '',
        description: '',
        price: '9.99',
        paid: true,
        loading: false,
        category: "",
        audio: {},
        video: {},
        lessons: [],
    });

    const [image, setImage] = useState({});

    const [preview, setPreview] = useState(false);
    const [previewAudio, setPreviewAudio] = useState(false);
    const [uploadButtonText, setUploadButtonText] = useState("Upload Image");
    const [dialogs, setDialogs] = useState([]);

    const [uploadVideoButtonText, setUploadVideoButtonText] = useState("Upload Video");
    const [uploadAudioButtonText, setUploadAudioButtonText] = useState("Upload Audio");
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState({});




    useEffect(() => {
        // console.log(slug);
        loadCourse();
    }, [slug]);

    const loadCourse = async () => {
        if(!slug) return;
        const {data} = await axios.get(`/api/user/course/${slug}`);

        
        setValues({...data, loading: false});
        

        if(data!=null&&data.image != undefined && data.image.Location != undefined ) {
            setImage(data.image);
            setPreview(true);
        } 


        if(data!=null && data.lessons != undefined ) {
            console.log('loaded', data.lessons);
            let allDialogs = [...data.lessons];
            for( var d =allDialogs.length-1; d>=0; d--) {
                allDialogs[d]["open"] = false;
            }
            setDialogs(allDialogs);
        }


    };

    useEffect(() => {
        loadCourse();
    }, [slug]);

   



    const handleChange = (e) => {
       
        setValues({ ...values, [e.target.name]: e.target.value })
    };

    const handleImage = (e) => {
        let file = e.target.files[0];
        if(file != undefined && file != null) {
            setPreview(true);
            setImage(window.URL.createObjectURL(file));
            setUploadButtonText(file.name);
            setValues({...values, loading: true});

            // resize
            Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async(uri) => {
                try {
                    let {data} = await axios.post('/api/course/upload-image', {
                        image: uri,

                    });
                    console.log("IMAGE UPLOADED", data);
                    // set image in the state
                    setImage(data);
                    setValues({ ...values, loading: false});

                } catch(err){
                    console.log(err);
                    setValues({...values, loading: false});
                    toast('Image upload failed. Try later.')
                }
            });

        } else {
            setPreview(false);
        }
    };

    const handleImageRemove = async (e) => {
        e.preventDefault();

        setValues({ ...values, loading: true});
        try {
            // console.log(values);
            const res = await axios.post(`/api/course/remove-image/${values.instructor._id}`, {image});
            setImage("");
            setPreview(false);
            setUploadButtonText('Upload Image');
            setValues({ ...values, loading: false});
        } catch(err) {
            setValues({ ...values, loading: false});
            console.log(err);
        }
    }



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
            const {data} = await axios.post(`/api/course/video-upload/${values.instructor._id}`, videoData, {
                onUploadProgress: (e) => {
                    setProgress(Math.round((100 * e.loaded) / e.total));
                }
            });

            // once response is recieved
            setValues({...values, video: data});

            setCurrent({...current, video: data});
            setPreview(true);
            setUploading(false);
            toast.success('Video uploaded Successfully, Please Save Your Lesson.');
        } catch(err) {
            console.log(err);
            setUploading(false);
            setUploadVideoButtonText('Upload audio');
            toast.error("Video upload failed");
        }    
    };


    const handleAudio = async (e) => {
        //    console.log(course);
        //    return;
        try {
            const file = e.target.files[0];
            if(!file) return;
            if( !file.type.match('audio/*') && !file.type.match('video/*') ) return;
            setUploadButtonText(file.name);
            setUploading(true);
            const audioData = new FormData();
            audioData.append('audio', file);

            // save progress bar and send video as form data to backend
            const {data} = await axios.post(`/api/course/audio-upload/${values.instructor._id}`, audioData, {
                onUploadProgress: (e) => {
                    setProgress(Math.round((100 * e.loaded) / e.total));
                }
            });

            // once response is recieved
            setValues({...values, audio: data});

            setCurrent({...current, audio: data});
            setPreviewAudio(true);
            setUploading(false);
            toast.success('Audio uploaded Successfully, Please Save Your Lesson.');
        } catch(err) {
            console.log(err);
            setUploading(false);
            e.target.value = null;
            setUploadAudioButtonText('Upload audio');
            toast.error("Audio upload failed");
        }    
    };


    const handleVideoRemove = async () => {
        // e.preventDefault();
        setUploading(true);
        
        try {
            const res = await axios.post(`/api/course/video-remove/${values.instructor._id}`, {video: current.video});
            setValues({...values, video: {}});
            setPreview(false);
            setProgress(0);
            setUploadButtonText('Upload another video');
            setUploading(false);
            setCurrent({...current, video: {}});
        } catch(err) {
            setUploading(false);
            console.log(err);
            toast.error('Video Remove Failed');
        }
    };





    const handleAudioRemove = async () => {
        // e.preventDefault();
        setUploading(true);
        
        try {
            const res = await axios.post(`/api/course/audio-remove/${values.instructor._id}`, {audio: current.audio});
            setValues({...values, audio: {}});
            setPreviewAudio(false);
            setProgress(0);
            setUploadAudioButtonText('Upload another audio');
            setUploading(false);
            setCurrent({...current, audio: {}});
        } catch(err) {
            setUploading(false);
            console.log(err);
            toast.error('Audio Remove Failed');
        }
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(values);
        try {

            const {data} = await axios.put(`/api/course/${slug}`, {
                ...values, image,
            });
            
            if(data.ok) {
                toast.success('Course Updated');
            }
            // router.push('/instructor');
        } catch(err) {
            toast(err.response.data)
        }
    };


    const handleDrag = (e, index) => {
        // console.log('ON DRAG', index);
        e.dataTransfer.setData('itemIndex', index);
    };

    const handleDrop = async (e, index) => {
        console.log('ON Drop', index);
        const itemIndex = e.dataTransfer.getData('itemIndex');
        const targetedItemIndex = index;
        let allLessons = values.lessons;
        let movingItem = allLessons[itemIndex]; // clickable/dragged item to re-order
        allLessons.splice(itemIndex, 1); // remove 1 item from the given index
        allLessons.splice(targetedItemIndex, 0, movingItem); // push item after target item index

        setValues({ ...values, lessons: [...allLessons] });

        const {data} = await axios.put(`/api/course/${slug}`, {
            ...values, image,
        });
        
        toast('Lessons rearranged successfully')
    }


        

    const handleDelete = (index, item) => {
        let allDialogs = [...dialogs];
      
        for( var d =allDialogs.length-1; d>=0; d--) {
            allDialogs[d]["open"] = false;
        }

        allDialogs[index]["open"] = true;

        setDialogs(allDialogs);
    };

    const DeleteLesson = async (index, item) => {
        let allLessons = values.lessons;
        allLessons.splice(index, 1);
        
        setValues({...values, lessons: allLessons});

        // send req to server
        const {data} = await axios.put(`/api/course/${slug}/${item._id}`, {
            ...values
        });
        if(data!=null&&data.ok != undefined) {
            loadCourse();
            toast('Lessons Deleted successfully');
        }
    };


    const handleClose = (index) => {
        console.log(index);
        let allDialogs = [...dialogs];
        allDialogs[index]["open"] = false;
        setDialogs(allDialogs);
    };

    
    const handleUpdateLesson = async (e) => {
        e.preventDefault();
        const {data} = await axios.put(`/api/course/lesson/${slug}/${current._id}`,
            current
        );
        setVisible(false);
        setUploadVideoButtonText('Upload Video');
        if( data.ok ) {
            let arr = values.lessons;
            const index = arr.findIndex((el) => el._id === current._id);
            arr[index] = current;
            setValues({...values, lessons: arr});
            toast('Lesson updated');
        }
    };

    

    
    return (
        <InstructorRoute>
            <Grid  container sx={{flexGrow: 1}} direction="row" >
                <Grid item onClick={() => router.push(`/instructor/course/view/${slug}`)}>

                    <ArrowBackIcon /> 
                </Grid>
                <Grid item  sx={{flexGrow: 1}} onClick={() => router.push(`/instructor/course/view/${slug}`)}>
                    <Typography variant="h5">
                    View Course: <small> {values.title} </small>
                    </Typography>
                </Grid>

                <Grid item sx={{ justifySelf: 'end'}}>
                    <a href={`/course/${slug}`} target="_blank">
                        Preview in new page
                    </a>
                </Grid>

            </Grid>

            <Grid  container direction="column" sx={{justifyContent: 'center'}}>
                {/* {JSON.stringify(values)} */}
                <Grid item container justifyContent="center" >
                   {values && values.title &&  <CourseCreateForm 
                        values={values} setValues={setValues} 
                        handleSubmit={handleSubmit} 
                        handleChange={handleChange} 
                        handleImage={handleImage}
                        preview={preview}
                        uploadButtonText={uploadButtonText}
                        handleImageRemove={handleImageRemove}
                        image={image}
                        editPage={true}
                        />
                   }
                 
                 
                    {/* <pre>
                    
                        {JSON.stringify(image, null, 1)}
                    </pre> */}
                </Grid>
                {values && values.lessons && values.lessons.length > 0 && <Grid container direction="column" sx={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>

                    <Typography variant="h6">
                            {values.lessons.length} Lessons
                    </Typography>
                    <Grid
                     item container direction="column" sx={{flexGrow: 1, maxWidth: '70% !important'}} justifyContent="space-between">
                    <Divider sx={{my: 1}} />
                           <List dense={true}
                            onDragOver={(e) => e.preventDefault()}
                           >
                           {/* {JSON.stringify(course.lessons[0], null, 4)} */}
    
                               {values && values.lessons && values.lessons.length > 0 && <>
                                {
                                    values.lessons.map((item, index) => (
                                            <ListItem
                                                key={item.slug+'-'+index}
                                                draggable
                                                onDragStart={e => handleDrag(e, index)}
                                                onDrop={e => handleDrop(e, index)}
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index, item)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                            >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    {index+1}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                            onClick={() => {
                                                setVisible(true);
                                                setCurrent(item);
                                                setProgress(0)
                                            }}
                                                primary={item.title}
                                            />
        
                                            {dialogs && dialogs.length > index &&<>
                                            
                                                <Dialog
                                                    open={dialogs[index]["open"]}
                                                    onClose={() => handleClose(index)}
                                                    aria-labelledby="responsive-dialog-title"
                                                    >
                                                    <DialogTitle id="responsive-dialog-title">
                                                    {"Are you sure to delete this item ?"}
                                                    </DialogTitle>
                                                    <DialogContent sx={{display: "flex"}}>
    
                                                    <Avatar sx={{maxWidth: "20%", }}>
                                                        {index+1}
                                                    </Avatar>
                                                    <DialogContentText sx={{maxWidth: "70%", padding: "4px 0 0 5px"}}>
    
                                                        {item.title}
                                                    </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                    <Button autoFocus onClick={() => handleClose(index)}>
                                                        Cancel
                                                    </Button>
                                                    <Button sx={{color:"#705b5b"}} onClick={() => DeleteLesson(index, item)} autoFocus>
                                                        Delete
                                                    </Button>
                                                    </DialogActions>
                                                </Dialog>                                        
                                            </>}
    
        
                                            </ListItem>
                                        ))
                                }
                               </>
    
                               }
                            </List>
                    </Grid>
                </Grid>
                }
                
            </Grid>


            <Dialog
                open={visible}
                onClose={() => { !values.loading && !uploading ? setVisible(false): ''}}
                aria-labelledby="responsive-dialog-title"
                >
                <DialogTitle id="responsive-dialog-title">
                {"Edit: " + current.title}
                </DialogTitle>
                <DialogContent sx={{display: "flex"}}>
                           <UpdateLessonForm 
                            current={current} setCurrent={setCurrent}
                            handleVideo={handleVideo}
                            handleAudio={handleAudio}
                            
                            handleUpdateLesson={handleUpdateLesson}
                            uploadVideoButtonText={uploadVideoButtonText}
                            progress={progress}
                            uploading={uploading}
                            preview={preview}

                            uploadAudioButtonText={uploadAudioButtonText}
                            handleVideoRemove={handleVideoRemove}

                            previewAudio={previewAudio}
                            handleAudioRemove={handleAudioRemove}
                           />
                </DialogContent>
                <DialogActions>
                <Button sx={{color:"#705b5b"}} disabled={values.loading || uploading} onClick={() => setVisible(false)}>
                    Cancel
                </Button>
                </DialogActions>
            </Dialog>  
            
        </InstructorRoute>
    )
}

export default CourseEdit;