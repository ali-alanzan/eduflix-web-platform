import express from 'express';


const router = express.Router();


// controllers
import {makeInstructor, getAccountStatus, currentInstructor, instructorCourses} from '../controllers/instructor';

// middleware
import {requireSignIn} from '../middleware';


router.post('/make-instructor', requireSignIn, makeInstructor);
router.post('/get-account-status', requireSignIn, getAccountStatus);
router.get('/current-instructor', requireSignIn, currentInstructor);
router.get('/instructor-courses', requireSignIn, instructorCourses);

module.exports = router;