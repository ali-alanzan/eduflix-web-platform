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
}) => { 

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
                value=""
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

                <label htmlFor="video-upload-file" style={{flexGrow: 1, maxWidth: '80%'}}>
    


                    <Button variant="contained" component="span" 
                        startIcon={!preview ? <MissedVideoCallIcon /> : undefined}
                        sx={{
                            backgroundColor: !preview ? "#9c27b0" : "#101010",
                            margin: "0 10px",
                            width: '100%',
                            color: preview ? '#333' : undefined
                        }}
                        disabled={preview}
                        >
                            
                        {uploadVideoButtonText}
                    </Button>

                    <Input accept="video/*" name="video" id="video-upload-file" 
                        type="file"  onChange={handleVideo} 
                        disabled={preview}
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
                <label style={{display: 'flex', flexGrow: 1,
                    width: '100%', maxWidth: '80%',
                    justifyContent: "center"}}>

                 
                    <ReactPlayer 
                        url={current.video.Location}
                        width="410px"
                        height="240px"
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
                    onClick={handleAddLesson}
                    loading={uploading.toString()}
                    type="primary"
                    disabled={ uploading }
                    variant="contained"
                    sx={{
                        marginBottom: '3rem',
                        width: '100%',
                        borderRadius: '80px',
                    }}

                    >
                    
                    

                    {
                        uploading ? `Saving...` : 'Save'
                    }
                </Button>
            </FormGroup>
        </form>
            )
}

export default UpdateLessonForm;