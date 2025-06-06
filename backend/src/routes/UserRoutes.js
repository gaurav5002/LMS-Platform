import express from "express";
import { protectRoute,adminaccess,instructorAccess,enrollmentAccess } from "../middleWare/authMiddleWare/protectRoute.js";
import { addCourse, addLesson, addMessage, addQuiz, addToCart, enroll, getAllCourses, getCartCourses, getCurrentCourse, getDiscussion, getLesson, getMyCourses, getMyIncome, getPendingRequests, getProgress, getQuiz, removeFromCart, submitQuiz, updateProgress } from "../controllers/userController.js";

//we will be using payment middle ware later on ... 
const router = express.Router();
router.use(protectRoute);


//
router.post("/addCourse",instructorAccess,addCourse);//done



router.post('/addLesson',instructorAccess,addLesson);//done



router.post('/getAllCourses',getAllCourses);//done



router.post('/enrollInCourse',enroll);//we will have to add the payment middle ware here like this router.post('/',payment,enroll);



router.post('/getCurrentCourse',getCurrentCourse);//done



router.post('/getDiscussion',getDiscussion);//done



router.post('/addMessage',addMessage);//done

router.post('/getLessons',enrollmentAccess,getLesson);// we will need the index of the lesson to the post index . //done

router.post('/getProgress',getProgress);//done 

// router.post('/getCurrentLesson',get)


router.post('/addToCart',addToCart);//done

router.post('/removeFromCart',removeFromCart);//done

router.post('/getCartCourses',getCartCourses);//done 


router.post('/getMyCourses',getMyCourses);//done


router.post('/addQuiz',instructorAccess,addQuiz);//done

router.post('/getQuiz',getQuiz);//done


router.post('/updateProgress',enrollmentAccess,updateProgress);//done 

router.post('/submitQuiz',submitQuiz);//done 


router.post('/getPendingRequests',adminaccess,getPendingRequests);

router.post('/getMyIncome',getMyIncome);





export default router;



