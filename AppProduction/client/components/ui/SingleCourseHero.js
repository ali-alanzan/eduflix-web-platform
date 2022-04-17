import { Grid, Paper, Typography, Button } from '@mui/material';
import Badge from '@mui/material/Badge';
import { currencyFormatter } from "../../../server/utills/helpers";
import ReactPlayer from 'react-player';
import CircularProgress from '@mui/material/CircularProgress';
import GppGoodIcon from '@mui/icons-material/GppGood';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import Box from '@mui/material/Box';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import Link from 'next/link';

const SingleCourseHero = ({
    course,
    user,
    loading,
    handlePaidEnrollment,
    handleFreeEnrollment,
    enrolled,
    handlePreviewDialog,
    
    }) => {

    const {title, description, instructor, updatedAt, lessons, image, price, paid, category, slug} = course;
    
    
   

    return (
            <Paper
                sx={{
                flexGrow: 1,
                backgroundImage: "linear-gradient(to right, #007bff, #000)",
                padding: "2.5rem",
                height: "22rem",
                marginTop: -1
                }}
            >
                <Grid container>
                    <Grid item sx={{flexGrow: 1, maxWidth: '70%'}} >
                        <Typography variant="h1"
                            sx={{
                                color: "#fff",
                                width: "100%",
                            }}
                            >
                            {title}
                        </Typography>
                        <Typography variant="body1">
                            {description}
                        </Typography>
                        <Badge color="primary" badgeContent={category}></Badge>
                        {instructor && instructor.name && <Typography variant="body2"
                            sx={{
                                color: "#fff",
                            }}
                            >
                            Created by {instructor.name}
                        </Typography>}
                        
                        <Typography variant="body2"
                            sx={{
                                color: "#fff",
                            }}
                            >
                            Last updated {new Date(updatedAt).toLocaleString()}
                        </Typography>
                        <Typography gutterBottom variant="h4">
                            {paid ? currencyFormatter({
                                amount: price,
                                currency: 'usd'
                            }) : 'Free'}
                        </Typography>
                        <Link href={`/user/course/podcasts/${slug}`} passHref>
                            <a>
                                <Button variant="contained" 
                                    
                                    sx={{
                                        color: '#fff', 
                                        backgroundColor: '#F26F23',
                                        borderRadius: '25px',
                                    }} startIcon={<LibraryMusicIcon />}>
                                    {enrolled.status ? 'Podcasts' : 'Enrollment required to listen'}
                                    
                                </Button>
                            </a>
                        </Link>
                        
                    </Grid>
                    <Grid item sx={{width: '30%'}}>
                    {lessons[0].video && lessons[0].video.Location ? (<div style={{position: 'relative'}} onClick={(event) => {
                        handlePreviewDialog(event);
                    }}>
                        <ReactPlayer 
                            url={lessons[0].video.Location}
                            light={image && image.Location ? image.Location : '/course.png'}
                            width="100%"
                            height={225}
                        />
                        <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 10, top: 0}}></div>
                    </div>) : (<img src={image && image.Location ? image.Location : '/course.png'} 
                                alt={title} 
                                style={{maxWidth: '75%', 
                                    maxHeight: 225,
                                    display: 'table', margin: '0 auto'}} 
                            />
                    )}    
                        
                        <Typography variant="body1">
                        </Typography>
                        <Typography variant="body1">
                        <Button 
                            color="secondary"
                            onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
                            loading={loading.toLocaleString()}
                            sx={{
                                marginTop: "22px",
                                width: '100%',
                                borderRadius: '25px'
                            }}
                            variant="contained" startIcon={!loading ? user 
                                ? enrolled.status 
                                    ? <CastForEducationIcon /> 
                                    : <GppGoodIcon />
                            : <ExitToAppIcon /> : ''}
                        >
                            {loading ? <CircularProgress /> : user 
                                ? enrolled.status 
                                    ? "Go to course" 
                                    : "Enroll" 
                            : "Login to enroll"}
                        </Button>
                        </Typography>
                    </Grid>
                </Grid>

            </Paper>
    )
}

export default SingleCourseHero;