import React, {useState, useEffect} from 'react';
import axios from 'axios';

import Hero from '../components/ui/Hero';
import { Grid } from '@mui/material';
import CourseCard from '../components/cards/CourseCard';
const Index = ({courses}) => {

    // const [courses, setCourses] = useState([]);

    // useEffect(() => {
    //     const fetchCourses = async () => {
    //         const {data} = await axios.get('/api/courses');
    //         setCourses(data);
    //     };
    //     fetchCourses();
    // }, []);

    return (
    <>
        <Hero title="Start Learn :)" />
        <Grid container direction="row" sx={{alignItems:"center", marginTop: '2rem'}} >
            {courses.map((course) => (
                <Grid item key={course._id} sx={{width: '30%', margin: '0 1%'}}>
                    <CourseCard course={course} />
                </Grid>
            ))}
            
        </Grid>
    </>
    )
};

export async function getServerSideProps() {
    const {data} = await axios.get(`${process.env.API}/courses`);
    return {
        props: {
            courses: data,
        },
    }
}

export default Index;