import express from "express";
import { protectRoute,adminaccess,instructorAccess,enrollmentAccess } from "../middleWare/authMiddleWare/protectRoute.js";
import { addCourse, addLesson, addMessage, addQuiz, addToCart, enroll, getAllCourses, getCartCourses, getCurrentCourse, getDiscussion, getLesson, getMyCourses, getPendingRequests, getProgress, getQuiz, removeFromCart, submitQuiz, updateProgress } from "../controllers/userController.js";

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



router.post('/users/getLessons',enrollmentAccess,getLesson);// we will need the index of the lesson to the post index . 



router.post('/users/updateProgress',enrollmentAccess,updateProgress);



router.post('/users/getProgress',getProgress);

router.post('/users/addQuiz',instructorAccess,addQuiz);

router.post('/users/submitQuiz',submitQuiz);

router.post('/users/addToCart',addToCart);

router.post('/users/removeFromCart',removeFromCart);

router.post('/users/getCartCourses',getCartCourses);

router.post('/users/getQuiz',getQuiz);

router.post('/users/getMyCourses',getMyCourses);




export default router;



