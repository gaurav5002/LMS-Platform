import express from "express";
import { protectRoute,adminaccess,instructorAccess,enrollmentAccess } from "../middleWare/authMiddleWare/protectRoute";
//we will be using payment middle ware later on ... 
const router = express.Router();
router.use(protectRoute);


//
router.post("/users/addCourse",instructorAccess,addCourse);



router.post('/users/addLesson',instructorAccess,addLesson);



router.post('/users/getAllCourses',getAllCourses);



router.post('/users/enrollInCourse',enroll);//we will have to add the payment middle ware here like this router.post('/',payment,enroll);



router.post('/users/getCurrentCourse',getCurrentCourse);



router.post('/users/getDiscussion',getDiscussion);



router.post('/users/addMessage',addMessage);



router.post('/users/getPendingRequests',adminaccess,getPendingRequests);



router.post('/users/getLessons',enrollmentAccess,getLessons);// we will need the index of the lesson to the post index . 



router.post('/users/updateProgress',updateProgress);



router.post('/users/getProgress',getProgress);

export default router;



