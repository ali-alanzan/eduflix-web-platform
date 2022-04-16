import {useEffect} from 'react';

import UserRoute from '../../../components/routes/UserRoute';
import {useRouter} from 'next/router';

import axios from 'axios';

import { Grid, Typography, Box, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const StripeSucces = () => {
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if(id) successRequest();

    }, [id]);

    const successRequest = async () => {
        const {data} = await axios.get(`/api/stripe-success/${id}`);
        // console.log('SUCCESS REQUEST', data);
        router.push(`/user/course/${data.course.slug}`);
    };

    return (
        <UserRoute showNav={false}>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container  direction="column" align="center" alignItems="center" 
                        justifyContent="center"  pt={8}>
                        <Grid sx={{maxWidth: '40rem', md: {maxWidth: '40rem'}, xs: {maxWidth: '97%'}}}>
                     
                        <Box
                            sx={{ height: '100vh !important',            
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingTop: "inherit",
                            }}
                            >
                            <CircularProgress />
                        </Box>
                         
                        </Grid>

                </Grid>
            </Box>
        </UserRoute>
    )
};

export default StripeSucces;