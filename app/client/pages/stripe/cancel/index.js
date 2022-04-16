import Link from 'next/link';
import CloudSyncIcon from '@mui/icons-material/CloudSync';

import UserRoute from '../../../components/routes/UserRoute';

import { Grid, Typography, Box, Button } from '@mui/material';

const Index = ({slug}) => {
    
    return (
        <UserRoute showNav={false}>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container  direction="column" align="center" alignItems="center" 
                        justifyContent="center"  pt={8}>
                        <CloudSyncIcon sx={{ fontSize: 140 }} />
                        <Grid sx={{maxWidth: '40rem', md: {maxWidth: '40rem'}, xs: {maxWidth: '97%'}}}>
                     
                            <Typography variant="body2">
                            Payment failed. Try again
                            </Typography>
                          
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    marginBottom: '3rem',
                                    width: '100%',
                                    borderRadius: '80px',
                                }}
                              
                                >
                                <Link href={`/course/${slug ? slug : ''}`} passHref>
                                    <a style={{
                                        color: '#e2e2e2',
                                    }}>
                                    Try again.
                                    </a>
                                </Link>
                            </Button>
                         
                        </Grid>

                </Grid>
            </Box>
        </UserRoute>
    )
}

export default Index;
