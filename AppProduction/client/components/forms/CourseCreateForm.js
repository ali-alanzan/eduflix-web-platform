import { useState, useEffect } from "react";
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { FormGroup, TextField, Grid, Avatar } from '@mui/material';
import { MenuItem, Select, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';


const Input = styled('input')({
    display: 'none',
  });

  
const CourseCreateForm = ({
    handleSubmit, handleChange, handleImage, preview, values, setValues, uploadButtonText
    , image, handleImageRemove
    
    , editPage = false
}) => { 
    console.log(image);
    console.log(preview);
    const children = [];
    for ( let i = 9.99; i <= 99.99; i++) {
        children.push(<MenuItem key={i.toFixed(2)} value={i.toFixed(2)}>${i.toFixed(2)}</MenuItem>)
    }


    return (
        <>
            {values && <>
            <form onSubmit={handleSubmit}>
                <FormGroup sx={{margin: "2rem auto"}}>
                    <TextField id="title" label="Title" 
                        name="title" 
                        value={values.title} 
                        onChange={handleChange} 
                        variant="filled" />
                </FormGroup>
                <FormGroup sx={{margin: "1rem auto"}}>
                    <TextField id="description" multiline
                    rows={4}
                    cols={7}
                    value=""
                    label="Description" 
                    name="description" 
                    value={values.description} 
                    onChange={handleChange} 
                    variant="filled" />
                </FormGroup>
                <FormGroup sx={{margin: "2rem auto"}}>
                    <Select
                    size="large"
                    value={values.paid}
                    onChange={(vpaid) => setValues({ ...values, paid: Boolean(vpaid.target.value), price: Boolean(vpaid.target.value) ? 9.99 : 0, }) }
                    name="paid"
                    >
                        <MenuItem
                            value={true}
                        >
                        Paid
                        </MenuItem>
                        <MenuItem
                            value={false}
                        >
                        Free
                        </MenuItem>
                    </Select>
                </FormGroup>

                {values.paid && <FormGroup sx={{margin: "2rem auto"}}>
                    <Select
                    size="large"
                    value={values.price}
                    onChange={(v) => setValues({ ...values, price: Number(v.target.value) }) }
                        >
                        <MenuItem>
                            Price
                        </MenuItem>
                        
                        {children}
                        
                    </Select>
                </FormGroup>

                }

                <FormGroup sx={{margin: "2rem auto", width: "30rem" }}>
                    <TextField id="category" label="Category" 
                        name="category" 
                        value={values.category} 
                        onChange={handleChange} 
                        variant="filled" />
                </FormGroup>

                <FormGroup sx={{margin: "2rem auto"}}>

                    <label htmlFor="image-upload-file" style={{
                        display: "flex",
                        flexDirection: "row"
                        }}

                        >
        


                        <Button variant="contained" component="span" 
                            startIcon={<CloudUploadOutlinedIcon />}
                            sx={{
                                backgroundColor: "#9c27b0",
                                width: '80%',
                                margin: "0 10px"
                            }}
                            disabled={preview}
                            >
                                
                            {uploadButtonText}
                        </Button>
                        {preview && image && image.Location && <>
                            <Badge badgeContent={"X"}  color="secondary" 
                                onClick={handleImageRemove} color="primary">
                                <Avatar width={200} src={image && image.Location} ></Avatar></Badge>
                        </>}

                        <Input accept="image/*" name="image" id="image-upload-file" 
                            disabled={preview}
                            type="file"  onChange={handleImage}

                            
                            />
                    </label>
                    
                </FormGroup>

                {editPage && <>
                    
                </>}

                <FormGroup  sx={{margin: "2rem auto"}}>
                    <Button 
                        onClick={handleSubmit}
                        loading={values.loading.toString()}
                        type="primary"
                        disabled={ values.loading || values.uploading }
                        variant="contained"
                        sx={{
                            marginBottom: '3rem',
                            width: '100%',
                            borderRadius: '80px',
                        }}

                        >

                        {
                            values.loading ? 'Saving...' : 'Save & Continue'
                        }
                    </Button>
                </FormGroup>
            </form>
        </>}</>);
            
}

export default CourseCreateForm;