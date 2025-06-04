import express from "express";
import { protectRoute,adminaccess,instructorAccess,enrollmentAccess } from "../middleWare/authMiddleWare/protectRoute.js";
import { addCourse, addLesson, addMessage, addQuiz, addToCart, enroll, getAllCourses, getCartCourses, getCurrentCourse, getDiscussion, getLesson, getMyCourses, getPendingRequests, getProgress, getQuiz, removeFromCart, submitQuiz, updateProgress } from "../controllers/userController.js";

//we will be using payment middle ware later on ... 
const router = express.Router();
router.use(protectRoute);


//
router.post("/addCourse",instructorAccess,addCourse);



router.post('/addLesson',instructorAccess,addLesson);



router.post('/getAllCourses',getAllCourses);



router.post('/enrollInCourse',enroll);//we will have to add the payment middle ware here like this router.post('/',payment,enroll);



router.post('/getCurrentCourse',getCurrentCourse);



router.post('/getDiscussion',getDiscussion);



router.post('/addMessage',addMessage);



router.post('/getPendingRequests',adminaccess,getPendingRequests);



router.post('/getLessons',enrollmentAccess,getLesson);// we will need the index of the lesson to the post index . 



router.post('/updateProgress',enrollmentAccess,updateProgress);



router.post('/getProgress',getProgress);

router.post('/addQuiz',instructorAccess,addQuiz);

router.post('/submitQuiz',submitQuiz);

router.post('/addToCart',addToCart);

router.post('/removeFromCart',removeFromCart);

router.post('/getCartCourses',getCartCourses);

router.post('/getQuiz',getQuiz);

router.post('/getMyCourses',getMyCourses);




export default router;



