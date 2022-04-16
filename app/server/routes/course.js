import express from 'express';
import formidable from 'express-formidable';


const router = express.Router();


// controllers
import {
    uploadImage,
    removeImage,
    create,
    read,
    readEnrolledCourse,
    update,
    uploadVideo,
    removeVideo,

    uploadAudio,
    removeAudio,

    addLesson,
    updateLesson,
    removeLesson,
    publishCourse,
    unPublishCourse,
    courses,
    checkEnrollment,
    freeEnrollment,
    paidEnrollment,
    stripeSuccess,
    userCourses,
    markCompleted,
    markInCompleted,
    listCompleted,

}  from "../controllers/course";


// middleware
import {isInstructor, requireSignIn, isEnrolled} from '../middleware';


// 
router.get('/courses', courses);

// image
router.post('/course/upload-image', requireSignIn, uploadImage);
router.post('/course/remove-image/:instructorId', requireSignIn, removeImage);



// Course
router.post('/course', requireSignIn, isInstructor, create);
router.get("/course/:slug", read);
router.get("/course/:slug", read);
router.put('/course/:slug', requireSignIn, update);

router.post("/course/video-upload/:instructorId", requireSignIn, formidable(), uploadVideo);
router.post("/course/video-remove/:instructorId", requireSignIn, removeVideo);


// AUDIO 


router.post("/course/audio-upload/:instructorId", requireSignIn, formidable(), uploadAudio);
router.post("/course/audio-remove/:instructorId", requireSignIn, removeAudio);


// publish unpublish
router.put("/course/publish/:courseId", requireSignIn, publishCourse);
router.put("/course/unpublish/:courseId", requireSignIn, unPublishCourse);


router.post("/course/lesson/:slug/:instructorId", requireSignIn, addLesson);
// update
router.put("/course/lesson/:slug/:instructorId", requireSignIn, updateLesson);

router.put("/course/:slug/:lessonId", requireSignIn, removeLesson);



// enroll
router.get('/check-enrollment/:courseId', requireSignIn, checkEnrollment );


// enrollment
router.post('/free-enrollment/:courseId', requireSignIn, freeEnrollment );
router.post('/paid-enrollment/:courseId', requireSignIn, paidEnrollment );
router.get('/stripe-success/:courseId', requireSignIn, stripeSuccess);


router.get('/user-courses', requireSignIn, userCourses);
router.get("/user/course/:slug", requireSignIn, isEnrolled, readEnrolledCourse);



router.post('/mark-completed/', requireSignIn, markCompleted);
router.post('/mark-incompleted/', requireSignIn, markInCompleted);
router.post('/list-completed/', requireSignIn, listCompleted);

module.exports = router;