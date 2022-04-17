import { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../../../components/ui/Hero';
import InstructorRoute from '../../../components/routes/InstructorRoute';
import { Grid } from '@mui/material';
import CourseCreateForm from '../../../components/forms/CourseCreateForm';
import Resizer from 'react-image-file-resizer';
import {toast} from 'react-toastify';
import { useRouter } from 'next/router';


const Create = () => {
    const router = useRouter();
    const [values, setValues] = useState({
        title: '',
        description: '',
        price: '9.99',
        uploading: false,
        paid: true,
        loading: false,
        category: "",
    });

    const [image, setImage] = useState({});

    const [preview, setPreview] = useState(false);
    const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

    const handleChange = (e) => {
       
        setValues({ ...values, [e.target.name]: e.target.value })
    };

    const handleImage = (e) => {
        let file = e.target.files[0];
        if(file != undefined && file != null) {
            setImage({Location: window.URL.createObjectURL(file)})
            setPreview(true);
            setUploadButtonText(file.name);
            setValues({...values, loading: true});

            // resize
            Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async(uri) => {
                try {
                    let {data} = await axios.post('/api/course/upload-image', {
                        image: uri,

                    });
                    console.log("IMAGE UPLOADED", data);
                    // set image in the state
                    setImage(data);
                    setValues({ ...values, loading: false});

                } catch(err){
                    // console.log(err);
                    setValues({...values, loading: false});
                    toast('Image upload failed. Try later.')
                }
            });

        } else {
            setPreview(false);
        }
    };

    const handleImageRemove = async (e) => {
        e.preventDefault();
        setValues({ ...values, loading: true});
        try {
            // console.log(values);
            const res = await axios.post('/api/course/remove-image', {image});
            setImage({});
            setPreview(false);
            setUploadButtonText('Upload Image');
            setValues({ ...values, loading: false});
        } catch(err) {
            setValues({ ...values, loading: false});
            console.log(err);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(values);
        try {

            const {data} = await axios.post('/api/course', {
                ...values, image,
            });
            

            toast('Great! Now you can start adding lessons');
            router.push('/instructor');
        } catch(err) {
            toast(err.response.data)
        }
    };



    return (
        <InstructorRoute>
            <Hero title="Create Course" />
            <Grid  container direction="column" >
                <Grid item container justifyContent="center">
                    <CourseCreateForm 
                        values={values} setValues={setValues} 
                        handleSubmit={handleSubmit} 
                        handleChange={handleChange} 
                        handleImage={handleImage}
                        preview={preview}
                        uploadButtonText={uploadButtonText}
                        handleImageRemove={handleImageRemove}
                        image={image}
                        />
{/*                  
                    <pre>
                        {JSON.stringify(image, null, 1)}
                    </pre> */}
                </Grid>
            </Grid>
        </InstructorRoute>
    )
}

export default Create;