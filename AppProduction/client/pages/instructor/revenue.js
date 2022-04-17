import { useState, useEffect, useContext } from "react";
import {Context} from '../../context';
import InstructorRoute from '../../components/routes/InstructorRoute';
import axios from 'axios';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CircularProgress from '@mui/material/CircularProgress';


import { Divider, Typography, Grid } from "@mui/material";

import { stripeCurrencyFormatter } from "../../../server/utills/helpers";


const InstructorRevenue = () => {
    const [balance, setBalance] = useState({ pending: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        sendBalanceRequest()
    }, []);

    const sendBalanceRequest = async () => {
        // console.log('SEND BALANCE REQUEST')
        const {data} = await axios.get('/api/instructor/balance');
        setBalance(data);

    };

    const handlePayoutsSettings = async () => {
        try {
            setLoading(true);
            const {data} = await axios.get('/api/instructor/payout-settings');
            window.location.href = data;

        } catch(err) {
            setLoading(false);
            console.log(err);
            alert('Unable to access payout settings. Try later');
        }
    }

    return <InstructorRoute>
        <Grid container direction="column">
            <Grid item  container sx={{flexGrow: 1, justifyContent: 'space-between'}}>
                <Typography variant="h2">
                    Revenue report

                    <Typography variant="body2">
                        You get paid directly from stripe to your bank account every 48 hour
                    </Typography>
                </Typography>
                <MonetizationOnOutlinedIcon sx={{fontSize: 44}} />

            </Grid>
            <Divider />
            {/* {JSON.stringify()} */}
            <Grid item container sx={{flexGrow: 1, justifyContent: 'space-between'}}>
                <Grid item>
                    <Typography variant="h4">
                        Pending Balance
                    </Typography>
                    <Typography variant="body2">
                        For last 48 hours
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h4">
                            {balance.pending && balance.pending.map((bp, i) => (
                                <span key={i}> {stripeCurrencyFormatter(bp)} </span>
                            ))}
                    </Typography>
                </Grid>
            </Grid>
            <Divider />
            <Grid item  container sx={{flexGrow: 1, justifyContent: 'space-between'}}>
                <Typography variant="h2">
                Payouts

                    <Typography variant="body2">
                    Update your stripe account details or view prevoius payouts
                    </Typography>
                </Typography>
                {!loading ? <SettingsOutlinedIcon sx={{fontSize: 44}} onClick={handlePayoutsSettings} /> : <CircularProgress />}
            </Grid>
        </Grid>
    </InstructorRoute>;
}
export default InstructorRevenue;