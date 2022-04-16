import { useState, useEffect } from "react";
import Link from "next/link";
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { FormGroup, TextField, Grid, Avatar } from '@mui/material';
import { MenuItem, Select, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import MissedVideoCallIcon from '@mui/icons-material/MissedVideoCall';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { FormControl, FormControlLabel, Switch } from '@mui/material';

import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ReactPlayer from 'react-player';
import AudioFile from '@mui/icons-material/AudioFile';
import SaveIcon from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';


const Input = styled('input')({
    display: 'none',
  });

  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }
const UpdateLessonForm = ({
    handleAddLesson, current, setCurrent, handleUpdateLesson, uploading, uploadVideoButtonText
    ,
    handleVideo, progress, visible, preview, handleVideoRemove
    ,
    handleAudio, previewAudio, handleAudioRemove, uploadAudioButtonText
}) => { 

    const [copyCurreny, setCopyCurreny] = useState(current);
    const [saveAttention, setSaveAttention] = useState(false);

    useEffect(() => {
        if( !Object.is(current, copyCurreny)  ) {
            setSaveAttention(true);
            return;
        };
        setSaveAttention(false);
    }, [current]);
    // console.log(typeof uploading);
    // return <></>;

    return (
        <form onSubmit={handleUpdateLesson}>
            <FormGroup sx={{margin: "2rem auto", width: "30rem" }}>
                <TextField id="title" label="Lesson Title" 
                    name="title" 
                    value={current.title} 
                    onChange={(v) => setCurrent({...current, title: v.target.value})} 
                    />
            </FormGroup>

            <FormGroup sx={{margin: "1rem auto"}}>
                <TextField id="content" multiline
                rows={4}
                cols={7}
                label="Content" 
                name="content" 
                value={current.content} 
                onChange={(v) => setCurrent({...current, content: v.target.value})} 
                />
            </FormGroup>

            <FormGroup sx={{margin: "2rem auto",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                }}>

                <label htmlFor="video-upload-file" style={{flexGrow: 1, maxWidth: '75%', marginRight: 3}}>
    


                    <Button variant="contained" component="span" 
                        startIcon={!preview ? <MissedVideoCallIcon /> : undefined}
                        sx={{
                            backgroundColor:"#9c27b0",
                            margin: "0 10px",
                            width: '100%',
                        }}
                        disabled={ uploading || (current && current.video && current.video.Location != undefined) ? true : false }
                        >
                            
                        {uploadVideoButtonText}
                    </Button>

                    <Input accept="video/*" name="video" id="video-upload-file" 
                        type="file"  onChange={handleVideo} 
                        disabled={ uploading || (current && current.video && current.video.Location != undefined) ? true : false }
                        />
                </label>

                    
                {!uploading && current && current.video && current.video.Location && 
                    (
                    <>
                <Badge badgeContent={"X"}  onClick={handleVideoRemove} 
                    color="error" 
                    >
                    <Avatar width={200} ><VideoCameraBackIcon /></Avatar>
                </Badge> 
                
                <Link href={current.video.Location}>
                    <a target="_blank">
                    <Avatar sx={{
                        marginLeft: '10px',
                        backgroundColor: '#58117e'
                    }}><PlayArrowIcon /></Avatar>

                    </a>
                </Link>
                {/* <label style={{display: 'flex', flexGrow: 1,
                    width: '100%', maxWidth: '80%',
                    justifyContent: "center"}}>

                 
                    <ReactPlayer 
                        url={current.video.Location}
                        forceHLS
                        width="410px"
                        height="240px"
                        controls
                    />
                
                </label> */}
                    </>)
                }
                
            </FormGroup>




            {/* AUDIO */}
            <FormGroup sx={{margin: "2rem auto",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                }}>

                <label htmlFor="audio-upload-file" style={{flexGrow: 1, maxWidth: '75%'}}>
    


                    <Button variant="contained" component="span" 
                        startIcon={!previewAudio ? <AudioFile /> : undefined}
                        sx={{
                            backgroundColor:"#9c27b0",
                            margin: "0 10px",
                            width: '100%',
                        }}
                        disabled={ uploading || (current && current.audio && current.audio.Location != undefined) ? true : false }
                        >
                            
                        {uploadAudioButtonText}
                    </Button>

                    <Input name="audio" id="audio-upload-file" 
                        type="file"  onChange={handleAudio} 
                        disabled={ uploading || (current && current.audio && current.audio.Location != undefined) ? true : false }
                        />
                </label>

                    
                {!uploading && current && current.audio && current.audio.Location && 
                    (
                    <>
                <Badge badgeContent={"X"}  onClick={handleAudioRemove} 
                    color="error" 
                    >
                    <Avatar width={200} ><GraphicEqIcon /></Avatar>
                </Badge> 
                
                <Link href={current.audio.Location}>
                    <a target="_blank">
                    <Avatar sx={{
                        marginLeft: '10px',
                        backgroundColor: '#58117e'
                    }}><PlayArrowIcon /></Avatar>

                    </a>
                </Link>
                <label style={{display: 'flex', flexGrow: 1,
                    width: '100%', height: "100%", padding: '2rem 0',
                    justifyContent: "center", alignItems: 'center'}}>

                 
                    <ReactPlayer 
                        url={current.audio.Location}
                        width="70%"
                        height="60px"
                        forceaudio
                        controls
                    />
                
                </label>
                    </>)
                }
                
            </FormGroup>

            {progress <= 100 && uploading && <FormGroup  sx={{margin: "2rem auto"}}>
                <LinearProgressWithLabel value={progress} />
            </FormGroup>}

            
            <FormGroup>
                <FormControlLabel
                    value="free_preview"
                    control={<Switch color="primary" onChange={(s) => setCurrent({...current, free_preview: s.target.checked})} checked={current.free_preview }/>}
                    label="Preview"
                    labelPlacement="start"
                    sx={{justifyContent:"space-between"}}
                />
            </FormGroup>


            <FormGroup  sx={{margin: "2rem auto"}}>
                <Button 
                    onClick={() => {handleAddLesson}}
                    loading={uploading.toString()}
                    type="primary"
                    disabled={ uploading }
                    variant="contained"
                    sx={{
                        marginBottom: '3rem',
                        width: '100%',
                        borderRadius: '80px',
                        color: !saveAttention ? undefined : '#FFCC00', 
                        backgroundColor: !saveAttention ? undefined : '#58117e', 
                    }}

                    >
                    
                    

                    {
                        uploading ? <> Uploading <CircularProgress /> </> : saveAttention ? <> Please SAVE <SaveIcon sx={{marginLeft: 2}} /> </> : 'Save'
                    }
                </Button>
            </FormGroup>
        </form>
            )
}

export default UpdateLessonForm;