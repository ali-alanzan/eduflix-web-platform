import React, {useContext} from 'react';
import UserRoute from '../../components/routes/UserRoute';
import {Context} from '../../context';
import Typography from '@mui/material/Typography';
import Hero from "../../components/ui/Hero"

const UserIndex = () => {
    const {state: {user}, } = useContext(Context);



    return (
        <UserRoute>
                <Hero title="User Dashboard" />
                
                <Typography variant="h1"
                    align="center">
                    
                </Typography>
        </UserRoute>
    )
}

export default UserIndex;