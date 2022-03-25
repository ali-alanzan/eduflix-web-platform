import Hero from "../components/ui/Hero"

import React, { useEffect } from 'react';
import {Context} from '../context';

import {useRouter} from 'next/router';
import { styled } from '@mui/system';

import axios from 'axios';
import {toast} from 'react-toastify';

import Link from 'next/link';
import { useTheme } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


import TextField from '@mui/material/TextField';


import airplane from '../assets/send.svg';
import CircularProgress from '@mui/material/CircularProgress';



const useStyles = (theme) => {
    return {
        sendButton: {
            ...theme.typography.estimate,
            borderRadius: 50,
            height: 45,
            width: 245,
            fontSize: "1rem",
            backgroundColor: theme.palette.common.orange,
            "&:hover": {
                backgroundColor: theme.palette.secondary.light
            },
             md: {
                height: 40,
                width: 225
            }
        }
    }
};




export default function Login(props) {

    const theme = useTheme();
    const classes = useStyles(theme);


    const [email, setEmail] = React.useState("alistripeeduflixseller@gmail.com");
    const [emailHelper, setEmailHelper] = React.useState("");

    const [password, setPassword] = React.useState("Admin!97Admin");
    const [passwordHelper, setPasswordHelper] = React.useState("");

    const [open, setOpen] = React.useState(false);
    
    const [loading, setLoading] = React.useState(false);

    
    const router = useRouter();


    const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
    const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));

    const onChange = event => {
        let valid, valid1, valid2, valid3;
        const value = event.target.value;
        switch(event.target.id) {
            case 'email':
                setEmail(value);
                valid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
                if(!valid) {
                    setEmailHelper("Invalid E-mail");
                } else {
                    setEmailHelper("");
                }
                break;
            case 'password':
                setPassword(value);
                valid = /[A-Z]/g.test(value);
                valid1 = /[a-z]/g.test(value);
                valid2 = /[0-9]/g.test(value);
                valid3 = /[^A-z0-9]/g.test(value);
                
                console.log(value, valid, valid1, valid2, valid3)
                if(!valid || !valid1) {
                    setPasswordHelper("Your password must include more one characters ( A-z )");
                }  else if(!valid2) {
                    setPasswordHelper("Your password must include a number");
                }  else if(!valid3) {
                    setPasswordHelper("Your password must include unique character");
                }  else {
                    setPasswordHelper("");
                }
                break;
            default:
                break;
        }
    }

    const onConfirm = () => {
        
    }

    const  {state, dispatch} = React.useContext(Context);
    const {user} = state;
    useEffect(() => {
        if (user !== null) {
            router.push("/");
        }
    }, [user]);

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        
            setLoading(true);

            const {data} = await axios.post('/api/login', {
                    email, password
            });

            dispatch({
                type: "LOGIN",
                payload: data,
            });

            // save in local storage
            window.localStorage.setItem('user', JSON.stringify(data));

            // redirect
            router.push('/');
            // console.log("Login Response", data);

        } catch (err) {
            toast(err.response.data);
            setLoading(false);
        }
    }
    
    const ForgetPasswordLink = styled('a')({
        color: theme.palette.error.light
    })  
    return(
        <>
        <Hero title="Login" />
        <form onSubmit={handleSubmit}>
            <Grid container direction="row" pt={4}>
                <Grid item container direction="column" alignItems="center" 
                    justifyContent="center" 
                    sx={{marginBottom: matchesMD ? "5em" : 0, 
                        marginTop: matchesSM ? "1em" : matchesMD ? "5em" : 0}}
                    lg={4}>

                    <Grid item>
                        <Grid item container direction="column">
                            
                            <Grid item container direction="column" sx={{maxWidth: "20em"}}>
                                <Grid item sx={{marginBottom: ".5em"}}>
                                    <TextField label="Email" error={emailHelper.length !== 0} 
                                        helperText={emailHelper}
                                        fullWidth id="email" variant="standard" value={email} 
                                        onChange={onChange} />
                                </Grid>
                                <Grid item sx={{marginBottom: ".5em"}}>
                                    <TextField label="Password" error={passwordHelper.length !== 0} 
                                        helperText={passwordHelper}
                                        fullWidth id="password" variant="standard"  value={password} 
                                        onChange={onChange}/>
                                </Grid>

                            </Grid>

                
                            <Grid item container justifyContent="center" sx={{marginTop: "2em"}}>
                                <Button 
                                    type="submit"
                                    disabled={ emailHelper.length !== 0 || passwordHelper.length !== 0 }
                                    variant="contained"
                                    sx={{
                                        ...classes.sendButton
                                    }}>

                                    {
                                        loading ? <CircularProgress />
                                        : <> 
                                        Login <img src={airplane.src} alt="paper airplan" sx={{marginLeft: "1em"}} />
                                        </>
                                    }
                                </Button>

                            </Grid>

                            <Grid item container justifyContent="center" sx={{margin: "2em auto"}}>
                                <Typography variant="body1" align="center">
                                    Not yet Registered? <Link href="/register"> Register </Link>
                                </Typography>
                            </Grid>

                            <Grid item container justifyContent="center" sx={{margin: "2em auto"}}>
                                <Link href="/forget-password" passHref>
                                    <ForgetPasswordLink>
                                        Forget Password? 
                                    </ForgetPasswordLink>
                                </Link>
                            </Grid>


                        </Grid>
                    </Grid>

                </Grid>

               

            </Grid>
        </form>
        </>
    )
}
