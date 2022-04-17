import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Hero from '../../components/ui/Hero';
import InstructorRoute from '../../components/routes/InstructorRoute';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Tooltip from '@mui/material/Tooltip';


const Instructor = () => {

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        const {data} = await axios.get('/api/instructor-courses');
        setCourses(data);
    }

    return (
        <InstructorRoute>
            <Hero title="Instructor" />
            <Grid container direction="column">
                {
                    courses.map(course => (
                        <Grid item key={course.slug} sx={{ marginTop: '1rem'}}>
                            <Card>
                            <CardHeader
                                sx={{paddingBottom: '0'}}
                                avatar={
                                <Avatar 
                                    sx={{ width: 86, height: 86, bgcolor: red[500] }}
                                    aria-label="course image" src={course && course.image && course.image.Location ? course.image.Location : '/course.png'}>
                                    {course.title[0]}
                                </Avatar>
                                }
                                title={<Link href={`/instructor/course/view/${course.slug}`} passHref><Typography sx={{color: 'inherit'}} variant="h6" component="a">{course.title}</Typography></Link>}
                                subheader={`${course.lessons.length} Lessons`}
                                action={
                                    course.published ? <Tooltip title="Published"><Button variant="outlined" color="success" startIcon={<CheckCircleOutlineOutlinedIcon />}></Button></Tooltip> : <Tooltip title="Unpublished"><Button variant="outlined" color="error" startIcon={<VisibilityOffOutlinedIcon />}></Button></Tooltip>
                                  }
                            />
                            <CardContent sx={{padding: '0 0 0 122px'}}>
                                <Typography variant="body2" color={course.lessons.length < 5 ? 'warning.main' : course.lessons.published ? 'success.main' : 'secondary.main'}>
                                {course.lessons.length < 5 ? 'At least 5 lessons required to publish a course' 
                                : course.published ? 'Your Course is live in the marketplace' : 'Your Course is ready to published'

                                }
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton aria-label="Edit">
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>
                            
                            </CardActions>
                            </Card>
                        </Grid>
                    ))
                }

            </Grid>
        </InstructorRoute>
    )
}

export default Instructor;