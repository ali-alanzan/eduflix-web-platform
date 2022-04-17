
import Typography from '@mui/material/Typography';

import Avatar from '@mui/material/Avatar';

import Link from 'next/link';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Grid, Button  } from '@mui/material';
import HeadphonesIcon from '@mui/icons-material/Headphones';

const MapCoursesToWatch = ({courses}) => {

    return (
        <Grid item container sx={{flexGrow: 1, mb: 3}}>
            {courses && courses.map(course => (
                <Grid item key={course._id} container direction="row" sx={{
                    flexGrow: 1,
                    
                    }}
                >
                    <Grid item 
                        sx={{margin: '0 10px'}}
                    >
                        <Avatar 
                            size={120} 
                            src={course.image && course.image.Location ? course.image.Location : '/course.png'}
                        />
                    </Grid>

                    <Grid item>
                        <Link 
                            href={`/user/course/${course.slug}`}
                            passHref
                        >
                            <a>
                                <Typography variant="h5">
                                    {course.title}
                                </Typography>
                            </a>
                        </Link>
                        <Typography variant="body2">
                            {course.lessons.length} Lessons
                        </Typography>

                        <Typography variant="body1">
                            By {course.instructor.name}
                        </Typography>
                    </Grid>
                    <Grid item container
                        sx={{
                            flexGrow: 1,
                            justifyContent: 'end'
                        }}
                    >
                       <Grid item container
                        sx={{
                            maxWidth: '40%',
                            justifyContent: 'space-between',
                        }}
                       >
                        <Link 
                                href={`/user/course/podcasts/${course.slug}`}
                                passHref
                            >
                            <a>
                                <Button variant="contained" color='secondary' endIcon={<HeadphonesIcon />}>
                                    Podcasts
                                </Button>
                                
                            </a>
                        </Link>
                        <Link 
                            href={`/user/course/${course.slug}`}
                            passHref
                        >
                            <a>
                                <Button variant="contained" endIcon={<PlayArrowIcon />}>
                                    Resume
                                </Button>
                                
                            </a>
                        </Link>
                        </Grid>
                    </Grid>

                </Grid>
            ))}
        </Grid>
    )
} ;

export default MapCoursesToWatch;