import React, {useContext} from 'react';
import Link from 'next/link';
import { Context } from '../../context';
import axios from 'axios';


import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { makeStyles } from '@mui/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';




import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/styles';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import logo from '../../assets/Logo-v1edu.png';


import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { Paper } from '@mui/material';

function ElevationScroll(props) {
    const { children } = props;

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    }); 
}


const useStyles = (theme) => {

    return {
        toolbarMargin: {
            ...theme.mixins.toolbar,
            marginBottom: "2.5em",
            [theme.breakpoints.down('md')]: {
                marginBottom: "2em"
            },
            [theme.breakpoints.down('xs')]: {
                marginBottom: "1.25em"
            }
        },
    
        logoContainer: {
            padding: 0,
            margin: 0,
            "&:hover": {
                backgroundColor: "transparent"
            }
            
        },
        tabContainer: {
            marginLeft: 'auto'
        },
        tab: {
            ...theme.typography.tab,
            minWidth: 10,
            marginLeft: "25px"
        },
        button: {
            ...theme.typography.estimate,
            borderRadius: '50px',
            marginLeft: "25px",
            marginRight: "25px",
            height: "45px",
            "&:hover": {
                backgroundColor: theme.palette.secondary.light
            }
        },
        menu: {
            backgroundColor: theme.palette.common.blue,
            color: 'white',
            borderRadius: 0
        },
        menuItem: {
            ...theme.typography.tab,
            color: "inherit",
            opacity: .7,
            "&:hover, &.Mui-selected": {
                opacity: 1
            },
    
        },
        drawerIconContainer: {
            marginLeft: "auto"
        },
        drawerIcon: {
            height: "50px",
            width: "50px",
        },
        drawer: {
            backgroundColor: theme.palette.common.blue
        },
        drawerItem: {
            ...theme.typography.tab,
            color: 'white',
            opacity: .7
        },
        drawerItemSelected: {
            "& .MuiListItemText-root": {
                opacity: 1
            }
    
        },
        drawerItemEstimate: {
            backgroundColor: theme.palette.common.orange,
            marginTop: '10px'
        },
        appbar: {
            
        }
    }
};


const Header = (props) => {
    
    
    const theme = useTheme();
    const classes = useStyles(theme);
    const iOS =
      typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);


    const matches = useMediaQuery(theme.breakpoints.down('md'));
    const [openDrawer, setOpenDrawer] = React.useState(false);

    const [value, setValue] = [props.value, props.setValue];
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openMenu, setOpenMenu] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = [props.selectedIndex, props.setSelectedIndex];


    const  {state, dispatch} = useContext(Context);
    const { user } = state;

    const logout = async () => {
        dispatch({
            type: 'LOGOUT'
        });
        window.localStorage.removeItem('user');
        const {data} = await axios.get("/api/logout");

        toast(data.message);
        router.push('/login')
    }

    
    const router = useRouter();

    
    const handleChange = (e, newValue) => {
        setValue(newValue);
    }

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
        setOpenMenu(true);
    }

    const handleMenuItemClick = (e, i) => {
        setAnchorEl(null);
        setOpenMenu(false);
        setSelectedIndex(i);
    }



    const handleClose = (e) => {
        setAnchorEl(null)
        setOpenMenu(false)
    }



    const routes = [
        {name: "Home", link: "/", activeIndex: 0},
        // {
        //     name: "Services", link: "/services", activeIndex: 1,
        //     ariaOwns: anchorEl ? "simple-menu" : undefined,
        //     ariaPopup: anchorEl ? "true" : undefined,
        //     mouseOver: event => handleClick(event)
        // },
        
    ];

    if( user && user.role && user.role.includes("Instructor") ) {
        routes.push(
            {name: "Create Course", link: "/instructor/course/create", activeIndex: 1},
        )
    } else {
        routes.push(
            {name: "Become Instructor", link: "/user/become-instructor", activeIndex: 1},
        )
    }

    if( user && user.role && user.role.includes("Instructor") ) {
        routes.push(
            {name: "Instructor", link: "/instructor", activeIndex: 2},
        )
    }


    const userSubMenuIndex = 3;
    if ( user != null) {
        
        routes.push(
            {
                name: user && user.name, link: "#logout", activeIndex: userSubMenuIndex,
                ariaOwns: anchorEl ? "logout-submenu" : undefined,
                ariaPopup: anchorEl ? "true" : undefined,
                mouseOver: event => handleClick(event),
                icon: <LocalCafeOutlinedIcon fontSize="small" />
            }
        );
        // userSubMenuOptions.push({
        //         name: "Services",
        //         link: "/services",
        //         activeIndex: 1,
        //         selectedIndex: 0
        // });
    } else {
        routes.push(
            {name: "Login", link: "/login", activeIndex: 2},
            {name: "Register", link: "/register", activeIndex: 3},
        )
    }

    const userSubMenuOptions = [
        // {
        //     name: "Services",
        //     link: "/services",
        //     activeIndex: 1,
        //     selectedIndex: 0
        // },
        {
            name: "Dashboard",
            link: "/user",
            activeIndex: userSubMenuIndex,
            selectedIndex: 0
        },

    ];

    React.useEffect(() => {
        const pathName = window.location.pathname;
        
        [...userSubMenuOptions, ...routes].forEach(route => {
            switch(pathName) {
                case `${route.link}`:
                    if( value !== route.activeIndex) {
                        setValue(route.activeIndex)
                        if(route.selectedIndex && route.selectedIndex !==  selectedIndex) {
                            setSelectedIndex(route.selectedIndex);
                        }
                    }
                    break;
                case '/freetrial':
                    setValue(userSubMenuOptions.length+1);
                    break;
                default:
                    break;
            }
        })
    }, [value, selectedIndex,userSubMenuOptions, routes]);



    const tabs = (
        <React.Fragment>
            <Tabs
            value={value} 
            onChange={handleChange} 
            sx={{...classes.tabContainer}}
            indicatorColor="secondary"
            textColor="inherit"
            >                
                {
                    routes.map((route, index) => (
                        <Link href={route.link}
                        key={`${route}${index}`}
                        >
                            <Tab 
                            sx={{...classes.tab}}
                            label={route.name}
                            aria-owns={route.ariaOwns}
                            aria-haspopup={route.ariaPopup}
                            onMouseOver={route.mouseOver}
                            icon={route.icon ? route.icon : undefined}
                            iconPosition={route.icon ? "start" : undefined}
                            />
                        </Link>
                        ))
                }
            </Tabs>

            <Button variant="contained"  
            onClick={() => props.setValue(userSubMenuOptions.length+1)} 
            color="secondary" sx={{...classes.button}}>
                <Link href="/freetrial">Free Account</Link>
            </Button>
            <Menu
            id="logout-submenu" anchorEl={anchorEl} open={openMenu}
            onClose={handleClose}
            MenuListProps={{onMouseLeave: handleClose}}
            classes={{paper: classes.menu}}
            elevation={0}
            style={{zIndex: 1302}}
            keepMounted
            >
                {
                    userSubMenuOptions.map((option, i) => (
                        <MenuItem 
                            key={i}
                            onClick={(event) => {
                                handleMenuItemClick(event, i)
                                setValue(1);
                                handleClose();
                            }} 
                            selected={i === selectedIndex && value === 1}
                            classes={{root: classes.menuItem}}
                            >
                            <Link href={option.link}>
                                {option.name}
                            </Link>
                        </MenuItem>
                    ))
                }
                        <MenuItem 
                            onClick={logout} 
                            classes={{root: classes.menuItem}}
                            >
                            <ListItemIcon>
                                <ExitToAppIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Logout</ListItemText>
                        </MenuItem>

            </Menu>
        </React.Fragment>
    )

    const drawer = (
        <React.Fragment>
            <SwipeableDrawer 
            disableBackdropTransition={!iOS} 
            disableDiscovery={iOS} open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            onOpen={() => setOpenDrawer(true)}
            classes={{paper: classes.drawer}}
            >
                <div sx={{...classes.toolbarMargin}}></div>
            <List disablePadding>

                {
                    routes.map((route, index) => (
                        <ListItemButton
                            key={`${route}${index}`}
                            onClick={() => {setOpenDrawer(false); setValue(route.activeIndex)}} 
                            divider button="true"
                            selected={value === route.activeIndex}
                            classes={{selected: classes.drawerItemSelected}}
                            >
                            <Link href={route.link}>
                                {
                                    route.icon ? <ListItemIcon> {route.icon} </ListItemIcon> : undefined
                                }
                                <ListItemText  
                                sx={{...classes.drawerItem}} 
                                disableTypography>
                                    {route.name}                             
                                </ListItemText>
                            </Link>
                        </ListItemButton>
                    ))
                }

                    <ListItemButton
                        onClick={() => {setOpenDrawer(false); setValue(5)}} 
                        divider button="true"
                        selected={value === 5}
                        classes={{root: classes.drawerItemEstimate, selected: classes.drawerItemSelected}}
                        >
                        <Link href='/freetrial'>
                            <ListItemText  
                            sx={{...classes.drawerItemSelected}} 
                            disableTypography>
                                Free Account
                            </ListItemText>
                        </Link>
                    </ListItemButton>
            </List>
            </SwipeableDrawer>

            <IconButton 
            sx={{...classes.drawerIconContainer}}
            onClick={() => setOpenDrawer(!openDrawer)}
            disableRipple
            >
                <MenuIcon sx={{...classes.drawerIcon}} />
            </IconButton>

        </React.Fragment>
    )
            
    return (

        <React.Fragment>
            {/* Your component tree. Now you can override MUI's styles. */}
            <ElevationScroll>
            <AppBar position="fixed" sx={{...classes.appbar}}>
                <Toolbar disableGutters>
                    <Button sx={{...classes.logoContainer}}
                    onClick={() => setValue(0)}
                    disableRipple
                    >
                        <Link href="/">
                            <img alt="company logo" style={{
                                height: "auto",
                                maxWidth: "14rem",
                            }} src={logo.src} />
                        </Link>
                    </Button>

                    {matches ? drawer : tabs}
                    
                </Toolbar>
            </AppBar>
        </ElevationScroll>
        <Paper sx={{...classes.toolbarMargin}} />
        </React.Fragment>
    )
}
export default Header;