import { useContext, useState } from 'react';
import { Context } from '../../context';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';  
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import axios from 'axios';
import Hero from '../../components/ui/Hero';
import SettingsIcon from '@mui/icons-material/Settings';
import UserSwitchOutlined from '../../assets/user-switch.svg';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import UserRoute from '../../components/routes/UserRoute';
import Grid from '@mui/material/Grid';
import { CssBaseline, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  
const BecomeInstructor = () => {

    // state
    const [loading, setLoading] = useState(false);
    const {state: {user}} = useContext(Context);
    const theme = useTheme();

    const becomeInstructor = () => {
        // console.log('becomeInstructor');
        setLoading(true);
        axios.post('/api/make-instructor')
        .then((res) => {
            console.log(res);
            window.location.href = res.data;
        })
        .catch((err) => {
            console.log(err.response.data);
            // if(err.response.status == 403) {
            //     toast(err.response.data);
            // } else {

            // }
            toast('Stripe onboarding failed. Try again');
            
            setLoading(false);
        });
    }

    return (
        <>
            <Hero title="Become Instrcutor" />
            <Box sx={{ flexGrow: 1 }}>
                <Grid container  direction="column" align="center" alignItems="center" 
                        justifyContent="center"  pt={4}>
                        <img src={UserSwitchOutlined.src} />
                        <Grid sx={{maxWidth: '40rem', md: {maxWidth: '40rem'}, xs: {maxWidth: '97%'}}}>
                            <Paper><Typography variant="h2" component="h2">
                            Setup payout to publish to publish courses on Eduflix
                            </Typography></Paper>

                            <Typography variant="h4" component="p" 
                            sx={{color: theme.palette.secondary.main, margin: '20px 0 40px 0'}}>
                                Eduflix partners with stripe to transfer earnings to your bank account
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    marginBottom: '3rem',
                                    width: '100%',
                                    borderRadius: '80px',
                                    backgroundColor: theme.palette.common.blue                              
                                }}
                                startIcon={loading ? <CircularProgress /> : <SettingsIcon /> }
                                disabled={
                                    (user && user.role && user.role.includes("Instructor")) ||
                                    loading
                                }
                                onClick={becomeInstructor}
                                >
                                {loading ? 'Processing...' : 'Payout Setup'}
                            </Button>
                            <Typography variant="body2">
                                You will be redirected to stripe to complete onboarding process
                            </Typography>
                        </Grid>

                </Grid>
            </Box>
        </>
    )
}

export default BecomeInstructor;