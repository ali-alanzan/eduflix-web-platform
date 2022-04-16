import {useContext, useEffect} from 'react';
import {Context} from '../../context';
import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';
import { toast } from 'react-toastify';


const StripeCallback = () => {
    const {state: {user}, dispatch} = useContext(Context);

    useEffect(() => {
        if (user) {
            axios.post('/api/get-account-status').then((res) => {
                // console.log(res);
                dispatch({
                    type: "LOGIN",
                    payload: res.data
                });

                window.localStorage.setItem("user", JSON.stringify(res.data));
                window.location.href = "/instructor";

            }).catch((err) => {
                toast('Error. Try Again')
            });
        }
    }, [user]);

    return (
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
    )
};

export default StripeCallback;