import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from "@emotion/react";
import ReactPlayer from 'react-player';
import SingleCourseLessons from "../../components/cards/SingleCourseLessons";

import { Typography, Grid, Divider } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from "@mui/material/Avatar";
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import 'mui-player/dist/mui-player.min.css'
import { useEffect, useState } from 'react';

const PreviewModal = ({
    previewClicked, setPreviewClicked,
    showModal, course, setShowModal,
    preview, previewTitle, lessons, 
    setPreview, setPreviewTitle
    }) => {
    
    const [prevProcess, setPrevProcess] = useState(false);
    
 
    let freeLessons = [];
    lessons.map(lesson => {
        if(lesson.free_preview == true) {
            freeLessons.push(lesson);
        }
    });


    useEffect(() => {
        


        loadMuiPlayer();

    }, [previewClicked]);
    
    
    const loadMuiPlayer = async () => {

        const loadingCheck = await new Promise((res) => {
            setTimeout(function () {
                res(true);
            }, 100);
        });
        
        console.log(previewClicked, showModal);
        if( previewClicked == -1 || showModal == false) return;
        setPreview( typeof(freeLessons[previewClicked].video.Location) != undefined ? freeLessons[previewClicked].video.Location : '' );
        setPreviewTitle( typeof(freeLessons[previewClicked].title) != undefined ? freeLessons[previewClicked].title : '' );
        
        const playerContainer = document.querySelector('#preview-player');
        
        // console.log(document);
        if( typeof(window) == undefined || preview.length <= 0 || playerContainer == null) return;
        document.querySelector('#ppr_item_'+previewClicked).click();
        setPrevProcess(true);
       
        const MuiPlayer = require('mui-player');        


        playerContainer.innerHTML = '';
        
        const randomC = 'player'+Math.floor( Math.random() * new Date().getMinutes() );
        const playerPreview = document.createElement('div');
        playerPreview.id = randomC;
        playerContainer.appendChild(playerPreview);

        var mp = new MuiPlayer({
            container:'#'+randomC,
            title: freeLessons[previewClicked].title,
            src: freeLessons[previewClicked].video.Location,
            themeColor:'#55c612', // Custom theme color
            lang: 'en',
            showMiniProgress: true,
            volume: 1,
            poster: course.image && course.image.Location ? course.image.Location : '/course.png',
            custom:{
                headControls:[
                 {
                     slot:'castScreen', // Corresponding to the defined slot value
                     click:function(e) { // Button click event callback
                         console.log('cast screen button click...');
                     },
                     style:{}, // Custom add control style
                 }
                ],
                footerControls:[
                    {
                        slot:'nextMedia', // Corresponding to the defined slot value
                        position:'left', // Display position, optional left, right
                        tooltip:'next media', // The text prompt displayed when the mouse is hovering over the control
                        oftenShow:false, // Whether to display frequently. The default is false, hidden in the vertical screen state in the mobile environment, hidden when the video container is less than 500px under the judgment of the pc environment
                        click:function(e) { // Button click event callback
                            console.log('next media button click...');
                        },
                        style:{}, // Custom add control style
                    },
                ],
            }
        });

        setPrevProcess(false);

    }



    return (
        <Dialog
            open={showModal}
            onClose={() => {
                setShowModal(!showModal); setPreviewClicked(-1);
            }}
            aria-labelledby="responsive-dialog-title"
            // fullWidth={true}
            maxWidth={"md"}
            >
            <DialogTitle id="responsive-dialog-title">
                {previewClicked == -1 ? '' : freeLessons[previewClicked].title}
                <IconButton
                    aria-label="close"
                    onClick={() => setShowModal(!showModal)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{display: "flex", flexDirection: "column", minWidth: '40rem'}}>
            <Grid container sx={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
            <div id="preview-player"></div>
            </Grid>
                {/* <ReactPlayer 
                    url={preview}
                    width="34rem"
                    height="100vh"
                    controls
                /> */}
                
                <Grid container sx={{flexGrow: 1}}>
                    <Grid item container direction="column">
                        <List>
                            {freeLessons && freeLessons.map((item, index) => (
                                <ListItem
                                    key={item.slug+'-'+index}
                                    secondaryAction= {item.video && item.video.Location !== undefined && item.free_preview && (
                                        <Button id={`ppr_item_${index}`} onClick={() => {
                                                // setPreview(item.video.Location);
                                                // setPreviewTitle(item.title);

                                                setPreviewClicked(index)
                                        }}
                                            startIcon={<VisibilityIcon color="primary" />}
                                            disabled={prevProcess}
                                            >
                                        Preview
                                        </Button>
                                        )}
                                >
                                <ListItemAvatar>
                                    <Avatar>
                                        {index+1}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.title}
                                />
                            
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </DialogContent>
            {/* <DialogActions>
            <Button autoFocus sx={{color: "#8499d5"}} onClick={() => setShowModal(!showModal)}>
                Cancel
            </Button>
            </DialogActions> */}
        </Dialog>
    )
};

export default PreviewModal;