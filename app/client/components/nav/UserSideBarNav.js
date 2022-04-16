import Link from 'next/link';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';



const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    maxWidth: 400,
    color: theme.palette.text.primary,
}));



const UserSideBarNav = ({menuItems}) => {
    const [active, setActive] = React.useState(1);
    const activeBg = '#bab1d6';

    const [current, setCurrent] = React.useState("");
    
    React.useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    return (
        <Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>

            {
                menuItems.map((item, i) => (
                    <StyledPaper
                            key={i}
                            sx={{
                            my: 2,
                            mx: 'auto',
                            p: 2,
                            backgroundColor: current === item.link ? activeBg : undefined
                            }}
                        >
                        <Grid container wrap="nowrap" spacing={2}>
                            <Grid item>
                                <Avatar>{item.avatar}</Avatar>
                            </Grid>
                            <Grid item xs>
                                <Link href={item.link}>
                                    <Button>
                                        {item.title}
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </StyledPaper>
                ))
            }
        </Box>
    )
}

export default UserSideBarNav;