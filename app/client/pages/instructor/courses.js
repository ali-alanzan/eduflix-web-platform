import React, {useContext, useEffect, useState} from 'react';
import InstructorRoute from '../../components/routes/InstructorRoute';
import {Context} from '../../context';
import Hero from "../../components/ui/Hero"
import axios from 'axios';
import { Box, Grid  } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import MapCoursesToWatch from '../../components/cards/MapCoursesToWatch';

const UserIndex = () => {
    const {state: {user}, } = useContext(Context);

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    

    const loadCourses = async () => {
        try {
            setLoading(true);
            const {data} = await axios.get('/api/user-courses');
            setCourses(data);
            setLoading(false);
        } catch(err) {
            console.log(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    return (
        <InstructorRoute>
                <Hero title="User Dashboard" />
                
                {/* <pre>{JSON.stringify(courses, null, 4)}</pre> */}
            {loading ? <Box
            sx={{ height: '100vh !important',            
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "inherit",
            }}
            >
            <CircularProgress />
        </Box> : ''}

        {/** show enrolled courses for this user */}
            <Grid container direction="column"
                sx={{
                    maxWidth: '70%',
                    width: '100%',
                    mt: 2,
                }}
            >
                <MapCoursesToWatch courses={courses} />
        </Grid>

        </InstructorRoute>
    );

}

export default UserIndex;