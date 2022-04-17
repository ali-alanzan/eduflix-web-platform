import { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';

import axios from 'axios';

import {useRouter} from 'next/router';
import StudentRoute from '../../../components/routes/StudentRoute';
import PlayLessonIcon from '@mui/icons-material/PlayLesson';

import { Button, Avatar, Grid, Typography } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import ReactMarkdown from  'react-markdown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import ReactPlayer from 'react-player';

import Tooltip from '@mui/material/Tooltip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
      
        ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
        }),
     
    }),
);


const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    top: 110,
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 10px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 10px)`,
    },
    top: 120,
});


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const SingleCourseUser = () => {

    const [clicked, setClicked] = useState(-1);
    const [completed, setCompleted] = useState([]);
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState({ lessons: [] });
    const [open, setOpen] = useState(true);
    

    const router = useRouter();
    const {slug} = router.query;
    const theme = useTheme();


    useEffect(() => {
        if(slug) loadCourse();
    }, [slug]);

    useEffect(() => {
        if(course) loadCompletedLessons();
    }, [course]);

    const loadCourse = async () => {
        if(!slug) return;
        try {
            const {data} = await axios.get(`/api/user/course/${slug}`);
            setCourse(data);
        } catch(err) {
            console.log(err);
        }
    };
    
    const loadCompletedLessons = async () => {
        const {data} = await axios.post(`/api/list-completed/`, {
            courseId: course._id
        });
        // console.log("COMPLETED LESSONS => ", data);
        setCompleted(data);
    };


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const markAsCompleted = async() => {
        const {data} = await axios.post('/api/mark-completed', {
            courseId: course._id,
            lessonId: course.lessons[clicked]._id
        });
        // console.log('MARK AS COMPLETED', data);
        // setCourse({...course});
        setCompleted([...completed, course.lessons[clicked]._id]);
    }
    const markAsInCompleted = async() => {
        try {
            const {data} = await axios.post('/api/mark-incompleted', {
                courseId: course._id,
                lessonId: course.lessons[clicked]._id
            });
    
            const all = completed;
            const index = all.indexOf(course.lessons[clicked]._id);
            console.log(all, index);
            if(index > -1) {
                all.splice(index, 1);
                setCompleted([...all]);
                console.log(all, index);
            }
        } catch(err) {
            console.log(err);
        }
        // setCompleted([...completed, lessons[clicked]._id]);

        // setCourse({...course});

        // console.log('INCOMPLETED', data);
    }

    
    return (
        <StudentRoute>

            {/* {JSON.stringify(course, null, 4)} */}

            <Grid container 
                sx={{
                    flexGow: 1,
                }}
            >
                <Grid item 
                    sx={{
                        maxWidth: '22rem',
                    }}
                >
                    <Drawer variant="permanent" open={open}>
                        <DrawerHeader>
                        {open && <Typography sx={{flexGrow: 1   }} variant="h5" align="center">{course.title}</Typography>}
                        <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
                            {!open ? <MenuOpenIcon /> : theme.direction === 'rtl' ? <ChevronRightIcon />: <ChevronLeftIcon />}
                        </IconButton>
                        </DrawerHeader>
                        <Divider />
                    
                        <Divider />
                        <List>
                        {course.lessons.map((lesson, index) => (
                            <ListItem button key={index} onClick={() => setClicked(index)}
                                selected={clicked === index}
                                // completed
                            >
                            <ListItemIcon>
                            <Tooltip title={<Typography variant="h6">{lesson.title}</Typography>} arrow placement="right">
                                <Avatar>{index+1}</Avatar>
                            </Tooltip>
                            </ListItemIcon>
                            <ListItemText primary={lesson.title} disableTypography={true} sx={{
                                whiteSpace: open ? 'initial' : undefined
                            }} />
                            <ListItemIcon>
                                {completed.includes(lesson._id) ? <CheckCircleOutlineIcon color="success" /> : <RemoveCircleOutlineIcon color="warning" />}
                            </ListItemIcon>
                            </ListItem>
                        ))}
                        </List>
                    </Drawer>
                </Grid>
            </Grid>

            <Grid item container
                sx={{
                    maxWidth: '75rem',
                    flexGrow: 1,
                    marginLeft: theme.direction === 'rtl' ? undefined : open ? '15.5rem' : '5rem',
                    marginRight: theme.direction !== 'rtl' ? undefined : drawerWidth,
                }}
            >
                <Grid   item container sx={{ flexGrow: 1, mb: 2 }} direction="row" onClick={() => router.push(`/course/${course.slug}`)}>
                    <Grid item>
                        <ArrowBackIcon /> 
                    </Grid>
                    {/* <Grid item md>
                        <Typography variant="h5">
                            Learning: <small>  </small>
                        </Typography>
                    </Grid> */}

                </Grid>
                {clicked == -1 ? (<>
                    <Grid item container sx={{ flexGrow: 1 }}>
                        <Grid item container direction="column" align="center" alignItems="center" 
                                justifyContent="center"  pt={4}>
                                <PlayLessonIcon sx={{fontSize: 120}}/>
                                <Grid sx={{maxWidth: '40rem', md: {maxWidth: '40rem'}, xs: {maxWidth: '97%'}}}>

                                    <Typography variant="h4" component="p" 
                                    sx={{color: theme.palette.secondary.main, margin: '20px 0 40px 0'}}>
                                        Click on the lessons to start learning
                                    </Typography>
                                    
                                </Grid>

                        </Grid>
                    </Grid>
                </>) : (
                    <Grid item container direction="column" sx={{ flexGrow: 1, maxWidth: '90%', alignItems: 'center', justifyContent: 'center'}}>
                    
                        <Grid container direction="row" 
                        sx={{justifyContent: 'flex-end', flexGrow: 1, maxWidth: '100% !important'}}
                        >
                            <Grid item sx={{flexGrow: 1}}>
                                <Typography variant="h5" component="h1">
                                    {course.lessons[clicked].title}
                                </Typography>
                            </Grid>
                            <Grid item sx={{width: '25%'}}>
                                <Button variant="text" onClick={completed.includes(course.lessons[clicked]._id) ? markAsInCompleted : markAsCompleted}>
                                    {completed.includes(course.lessons[clicked]._id) ? 'Mark incomplete' : 'Mark as completed'}
                                </Button>
                            </Grid>
                        </Grid>

                        {course.lessons[clicked].video && course.lessons[clicked].video.Location && (
                            <Grid item sx={{flexGrow: 1, maxWidth: '100%'}}>
                                <ReactPlayer 
                                    url={course.lessons[clicked].video.Location}
                                    width="100%"
                                    height="100%"
                                    onEnded={() => markAsCompleted(course.lessons[clicked]._id)}
                                    controls
                                />
                            </Grid>
                        )}
                        <Grid item container sx={{flexGrow: 1, justifyContent: 'center', maxWidth: '100%', padding: '20px 0'}}>
                            <Grid item>
                                {course.lessons[clicked].content}
                            </Grid>
                        </Grid>
                        {/* <ReactMarkdown source={course.lessons[clicked].video.Location} /> */}
                    </Grid>
                )}

            </Grid>
        
        </StudentRoute>
    )
}


export default SingleCourseUser;