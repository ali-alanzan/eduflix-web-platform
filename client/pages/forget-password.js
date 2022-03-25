import {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import { CircularProgress, Grid, useMediaQuery } from '@mui/material';
import Hero from '../components/ui/Hero';
import Link from 'next/link';
import {Context} from '../context';
import {useRouter} from 'next/router';
import { useTheme } from '@mui/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function ForgetPassword(props) {
    // state
    const [email, setEmail] = useState("");
    const [emailHelper, setEmailHelper] = useState("");
    const [success, setSuccess] = useState(false);
    const [code, setCode] = useState("");
    const [codeHelper, setCodeHelper] = useState("");
    const [password, setPassword] = useState("");
    const [passwordHelper, setPasswordHelper] = useState("");
    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState(false);

    const theme = useTheme();
    const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
    const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));
    // context 
    const {state: {user} } = useContext(Context);
    
    // router
    const router = useRouter();

    // redirect logged in
    useEffect(() => {
        if(user !== null) router.push("/");
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if(!success) {
                const {data} = await axios.post('/api/forget-password', { email });
                setSuccess(true);
                toast('Check your email for the secret code');
            }
            setLoading(false);
        } catch(err) {
            setLoading(false);
            toast(err);
        }
    }

    const onChange = (e) => {
        const id = e.target.id,
        value = e.target.value;
        let valid, valid1, valid2, valid3;

        switch(id) {
            case 'email':
                setEmail(value);
                valid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,7})+$/.test(value);
                if(!valid) {
                    setEmailHelper("Invalid E-mail");
                } else {
                    setEmailHelper("");
                }
                break;
            case 'code':
                setCode(value);
                valid = /[A-z0-9]{6}/.test(value);
                if(!valid) {
                    setCodeHelper("Invalid E-mail");
                } else {
                    setCodeHelper("");
                }
                break;
            case 'password':
                setPassword(value);
                valid = /[A-Z]/g.test(value);
                valid1 = /[a-z]/g.test(value);
                valid2 = /[0-9]/g.test(value);
                valid3 = /[^A-z0-9]/g.test(value);
                
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

    const handleResetPassword = async (e) => {
        e.preventDefault();
        console.log(email, code, password);
        // return;
        try {
            setLoading(true);
            const {data} = await axios.post('/api/reset-password', { email, code, password });
            if(data.ok) {
                setEmail("");
                setCode("");
                setPassword("");
                setLogin(true);
                toast.success('You new Password is ready to use, Please Login again.');
            }
            setLoading(false);
            toast('Great! Now you can login with your new password')
        } catch(err) {
            setLoading(false);
            toast(err);
        }
    }




    
    return(
        <>
        <Hero title="Reset Password" />
        <form onSubmit={!success ? handleSubmit : handleResetPassword}>
            <Grid container direction="row" pt={4}>
                <Grid item container direction="column" alignItems="center" 
                    justifyContent="center" 
                    sx={{marginBottom: matchesMD ? "5em" : 0, 
                        marginTop: matchesSM ? "1em" : matchesMD ? "5em" : 0}}
                    lg={4}>

                    <Grid item container sx={{width: '17em'}}>
                        <Grid item container direction="column">
                            
                            <Grid item container direction="column" sx={{maxWidth: "20em"}}>
                                <Grid item sx={{marginBottom: ".5em"}}>
                                    <TextField label="Email" error={emailHelper.length !== 0} 
                                        helperText={emailHelper}
                                        fullWidth id="email" variant="standard" value={email} 
                                        onChange={onChange} />
                                </Grid>

                                {
                                    success && <>
                                        <Grid item sx={{marginBottom: ".5em"}}>
                                        <TextField label="Short Code" error={codeHelper.length !== 0} 
                                        helperText={codeHelper}
                                        fullWidth id="code" variant="standard" value={code} 
                                        onChange={onChange} />
                                        </Grid>
                                        <Grid item sx={{marginBottom: ".5em"}}>
                                        <TextField label="Your New Password" error={passwordHelper.length !== 0} 
                                        helperText={passwordHelper}
                                        fullWidth id="password" variant="standard" value={password} 
                                        onChange={onChange} />
                                        </Grid>
                                    </> 
                                }

                            </Grid>

                
                            <Grid item container justifyContent="center" sx={{marginTop: "2em"}}>
                                <Button 
                                    type="submit"
                                    disabled={ emailHelper.length !== 0 || codeHelper.length !== 0 || passwordHelper.length !== 0}
                                    variant="contained"
                                    sx={{
                                        ...theme.typography.sendButton
                                    }}>

                                    {
                                        loading ? <CircularProgress />
                                        : <> 
                                        {
                                            success ? 'Set New Password' : 'Reset Password'
                                        }
                                        </>
                                    }
                                </Button>

                            </Grid>

                            {
                                login && <>
                                        <Grid item container justifyContent="center" sx={{margin: "2em auto"}}>
                                            <Link href="/login">
                                                Login Here 
                                            </Link>
                                        </Grid>
                                        </>
                            }

                        </Grid>
                    </Grid>

                </Grid>

               

            </Grid>
        </form>
        </>
    )

}