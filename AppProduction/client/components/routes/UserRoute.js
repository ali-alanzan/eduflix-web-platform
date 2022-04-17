import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import UserSideBarNav from '../nav/UserSideBarNav';
import Grid from '@mui/material/Grid';

import {Context} from '../../context';



const UserRoute = ({children, showNav=true}) => {
    const [hidden, setHidden] = useState(true);

    const router = useRouter();

    const fetchUser = async () => {
        try {
            const {data} = await axios.get('/api/current-user');
            // console.log(data);
            if (data.ok) {
                setHidden(false);
                // const {state: {user}, } = useContext(Context);

                // if(user.role.includes("Instructor")) {
                //     window.location.replace('/instructor');
                //     return;
                // }
            }


        } catch (err) {
            setHidden(true);
            // console.log(err);
            window.localStorage.removeItem('user');
            const {data} = await axios.get("/api/logout");
            window.location.href = window.location.host+'/login';
        }
    };
    
    useEffect(() => {
        fetchUser();
    }, []);

    const menuItems = [
        {
            icon: '',
            avatar: 'D',
            title: 'Dashboard',
            link: '/user'
        }
    ];
    return hidden ? (
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
    ) : (
            <Grid container spacing={1}>
                {showNav && <Grid item sx={{ position: 'relative' }}>
                    <UserSideBarNav menuItems={menuItems} />
                </Grid>}
                
                <Grid item sx={{ flexGrow: 1 }}>
                    {children}
                </Grid>
            </Grid>
    )
}

export default UserRoute;