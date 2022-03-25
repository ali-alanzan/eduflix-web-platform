import express from 'express';
import formidable from 'express-formidable';


const router = express.Router();


// controllers
import {
    uploadImage,
    removeImage,
    create,
    read,
    update,
    uploadVideo,
    removeVideo,
    addLesson,
    updateLesson,
    removeLesson,
    publishCourse,
    unPublishCourse,
}  from "../controllers/course";


// middleware
import {isInstructor, requireSignIn} from '../middleware';

// image
router.post('/course/upload-image', requireSignIn, uploadImage);
router.post('/course/remove-image/:instructorId', requireSignIn, removeImage);



// Course
router.post('/course', requireSignIn, isInstructor, create);
router.get("/course/:slug", read);
router.put('/course/:slug', requireSignIn, update);

router.post("/course/video-upload/:instructorId", requireSignIn, formidable(), uploadVideo);
router.post("/course/video-remove/:instructorId", requireSignIn, removeVideo);


// publish unpublish
router.put("/course/publish/:courseId", requireSignIn, publishCourse);
router.put("/course/unpublish/:courseId", requireSignIn, unPublishCourse);


router.post("/course/lesson/:slug/:instructorId", requireSignIn, addLesson);
// update
router.put("/course/lesson/:slug/:instructorId", requireSignIn, updateLesson);

router.put("/course/:slug/:lessonId", requireSignIn, removeLesson);



module.exports = router;