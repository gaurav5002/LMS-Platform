import { Course, Lesson } from "../models/Course.js";
import mongoose from "mongoose";
import User from "../models/user.js";
import UserProgress from "../models/UserProgress.js";
import Discussions from "../models/Discussions.js";
import Quiz from "../models/Quiz.js";
import Cart from "../models/Cart.js";
export async function addCourse(req,res){
    try {
        const user = req.user;
        if(user.role!=="instructor"){
            return res.status(403).json({message:"you are not allowed to add a course"});
        }
        const name = req.body.name;
        const photoUrl = req.body.photoUrl;
        const instructor = user._id;
        const description = req.body.description;
        const skills = req.body.skills;
        const price = req.body.price;//we can use the {} = req.body later on . 

        const newCourse = await Course.create({
            name,
            photoUrl,
            instructor,
            description,
            skills,
            price
        });
        const ProvidingCourses = user.enrolledCourses;//naming might be off but let us just stick with this 
        ProvidingCourses.push(newCourse._id);

        await User.findByIdAndUpdate(user._id,{
            enrolledCourses:ProvidingCourses
        })

        await Discussions.create({courseId:newCourse._id});

        return res.json({message:"course created succesfully ",newCourse});
    } catch (e) {
        return res.status(500).json({message:"internalServerError",e});
    }
}

export async function  addLesson(req,res) {
    try {
        const courseId = req.body.courseId;
        //adding a lesson is a bit difficult . waht you have to do is .
        //first we will provide an endpoint which takes input of files and returns their urls store them.
        //then we will have a create quiz enndpoint at our side which will return the quiz then you can extract the quizid from there and send it to the add lesson endpoint.set it to "" initially
        const user = req.user;
        const course = Course.findById(courseId);
        if(!course){
            return res.status(404).json({message:"no course exists"});
        }
        const instructor = course.instructor;

        if(user._id!==instructor){
            return res.status(403).json({message:"forbidden request you are not allowed to do this"})
        }

        const {title,videoUrl,notesUrl,quizId,duration,description} = req.body;

        const lesson = Lesson.create({
            courseId,
            title,
            videoUrl,
            notesUrl,
            quizId,
            duration,
            description
        })

        const lessons = course.lessons;
        if(!lessons.includes(lesson._id)){
            lessons.push(lesson._id);
        }

        await Course.findByIdAndUpdate(course._id,{
            lessons:lessons
        })

        return res.status(200).json({message:"Lesson has been added"});
    } catch (e) {
         return res.status(500).json({message:"internalServerError",e});
    }
}



export async function getAllCourses(req,res){
    try {
        const courses = await Course.find();//this is a bit problematic to be honest.
        return res.status(200).json({message:"fetched",courses});
    } catch (e) {
         return res.status(500).json({message:"internalServerError",e});
    }
}


export async function getCurrentCourse(req,res){
    try {
        const course = Course.findById(req.body.courseId);
        if(!course){
            return res.json(404).json({message:"course not found "});
        }
        return res.status(200).json({message:"course Fetched",course});

    } catch (e) {
        return res.status(500).json({message:"internalServerError",e});
    }
}

export async function enroll(req,res) {
    try {
        const user = req.user;
        const courseId = req.body.courseId;
        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({message:"course not found money will be given Refunded as soon as Possible Sorry for inconvinience"});
        }

        const enrolledCourses = user.enrolledCourses;
        if(!enrolledCourses.includes(courseId)){
            enrolledCourses.push(courseId);
        }

        await UserProgress.create({
            courseId,
            userId:user._id,
        })

        await User.findByIdAndUpdate(user._id,{
            enrolledCourses:enrolledCourses
        });

        return res.status(200).json({message:"enrollment success"});


    } catch (e) {
        return res.status(500).json({message:"internalServerError",e});
    }
}

export async function getDiscussion(req,res) {
    try {
        const courseId = req.body.courseId;
        const discussions = Discussions.findOne({courseId});
        if(!discussions){
            return res.status(404).json({message:"course not found discusion"});
        }
        return res.status(200).json({messages:discussions.messages});
    } catch (e) {
         return res.status(500).json({message:"internalServerError",e});
    }
}

export async function addMessage(req,res){
    try {
        const messageBody = req.body.messageBody;
        const courseId = req.body.courseId;
        const user = req.user;
        const discussion = Discussions.findOne({courseId:courseId});

        if(!user.enrolledCourses.includes(courseId)){
            return res.status(403).json({message:"forbidden you are not authorised to use this course"});
        }

        const messages = discussion.messages;

        let obj = {
            userId:user._id,
            message:messageBody,
            createdAt:Date.now()
        }

        messages.push(obj);
        await Discussions.findByIdAndUpdate(discussion._id,{
            messages:messages
        });

        return res.status(200).json({message:"message has been added"});

    } catch (e) {
        return res.status(500).json({message:"internalServerError",e});
    }
}

export async function getLesson(req,res){
    try {
        const user = req.user;
        const courseId = req.body.courseId;
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({message:"course not found"});
        }
        const lessons = course.lessons;
        if(!lessons||lessons.length<1){
            return res.status(204).json({lessons:[]});
        }
        if(!req.isenrolled){
            return res.status(201).json({lessons:lessons[0]});
        }
        return res.status(200).json({lessons:lessons});
    } catch (e) {
        return res.status(500).json({message:"internalServerError",e});
    }
}

export async function getPendingRequests(req,res){
    try {
        const requests = await Request.find();
        return res.status(200).json({message:"success",requests});
    } catch (e) {
          return res.status(500).json({message:"internalServerError",e});
    }
}



// progress functions 

export async function updateProgress(req, res) {
    try {
        const lessonidx = req.body.lessonidx;
        const user = req.user;
        const courseId = req.body.courseId;
        const progressVector = req.body.progressVector;
        const progressBar = await UserProgress.findOne({
            courseId,
            userId: user._id, 
        });
        if (!progressBar) {
            return res.status(404).json({ message: "Progress not found; cannot update." });
        }
        const lessonprogress = progressBar.progress;
        while (lessonprogress.length <= lessonidx) {
            lessonprogress.push([0, -1, 0]);
        }
        const updated = lessonprogress[lessonidx].map((val, idx) => val + progressVector[idx]);
        lessonprogress[lessonidx] = updated;
        await UserProgress.findByIdAndUpdate(progressBar._id, {
            progress: lessonprogress
        });
        return res.status(200).json({ message: "Progress updated successfully." });
    } catch (e) {
        console.error("Error updating progress:", e);
        return res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
}



export async function getProgress(req,res){
    try {
        const courseId = req.body.courseId;
        const user = req.user;
        if(!user||!courseId){
            return res.status(400).json({message:"baad request"});
        }
        const courseProgress = await UserProgress.findOne({
            courseId:courseId,
            userId:user._id
        });
        if(!courseProgress){
            return res.status(404).json({message:"progress not found"});
        }
        return res.status(200).json({message:"success",progress:courseProgress.progress});
    } catch (e) {
        return res.status(500).json({message:"internalServerError",e});
    }
}   



export async function addQuiz(req,res){
    try {
        const lessonId = req.body.lessonId;
        const {title,theoryQuestions,theoryAnswers,Mcqs,McqOpts} = req.body;
        const newQuiz = await Quiz.create({
            title,theoryQuestions,theoryAnswers,Mcqs,McqOpts
        });
        const lesson = await Lesson.findById(lessonId);
        if(!lesson){
            return res.status(404).json({message:"lesson does not exist"});
        }
        await Lesson.findByIdAndUpdate({
            quizId:newQuiz._id
        });
        return res.status(200).json({message:"successully completed"});
    } catch (e) {
         return res.status(500).json({message:"internalServerError",e});
    }
}


export async function submitQuiz(req, res) {
    try {
        const { submittedTheoryAnswers, submittedMcqOpts, lessonId, lessonidx, courseId } = req.body;
        const user = req.user;


        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        const existingProgress = await UserProgress.findOne({ courseId, userId: user._id });
        if (!existingProgress) {
            return res.status(404).json({ message: "User progress not found" });
        }
        const progress = existingProgress.progress;
        if (lessonidx < progress.length && progress[lessonidx][1] > -1) {
            return res.status(403).json({ message: "Quiz already submitted for this lesson" });
        }

        const quizId = lesson.quizId;
        const quiz = await Quiz.findById(quizId);
        const theoryKey = quiz.theoryAnswers || [];
        const mcqKey = quiz.McqAnswers || [];

        const lowerCaseSubmissions = submittedTheoryAnswers.map(str => str.toLowerCase());
        const lowerCaseKey = theoryKey.map(str => str.toLowerCase());

        let score = 0;

        for (let i = 0; i < Math.min(lowerCaseKey.length, lowerCaseSubmissions.length); i++) {
            if (lowerCaseKey[i] === lowerCaseSubmissions[i]) {
                score++;
            }
        }

        for (let i = 0; i < Math.min(mcqKey.length, submittedMcqOpts.length); i++) {
            if (mcqKey[i] === submittedMcqOpts[i]) {
                score++;
            }
        }

        const progressVector = [0, score + 1, 0];

        while (existingProgress.progress.length <= lessonidx) {
            existingProgress.progress.push([0, -1, 0]);
        }

        const updatedProgress = existingProgress.progress[lessonidx].map((val, idx) => val + progressVector[idx]);
        existingProgress.progress[lessonidx] = updatedProgress;

        await UserProgress.findByIdAndUpdate(existingProgress._id, {
            progress: existingProgress.progress
        });

        return res.status(200).json({
            message: "Quiz successfully submitted",
            marks: score
        });

    } catch (e) {
        console.error("Error submitting quiz:", e);
        return res.status(500).json({ message: "Internal server error", error: e.message });
    }
}


export async function getQuiz(req, res) {
    try {
        const { lessonId } = req.body;

        if (!lessonId) {
            return res.status(400).json({ message: "lessonId is required in the request body" });
        }
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: "Lesson not found" });
        }
        const quiz = await Quiz.findOne({ LessonId: lessonId });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found for this lesson" });
        }
        return res.status(200).json({
            mcqQuestions: quiz.Mcqs,
            mcqOptions: quiz.McqOpts,
            theoryQuestions: quiz.theoryQuestions
        });

    } catch (e) {
        console.error("Error in getQuiz:", e);
        return res.status(500).json({ message: "Internal server error", error: e.message });
    }
}


//cart functions 

export async function addToCart(req,res) {
    try {
        const user = req.user;
        const courseId = req.body.courseId;
        // const cartCourses
        if(!user||!courseId){
            return res.status(404).json({message:"missing fields . for user or course "});
        }
        const cart = await Cart.findOne({userId:user._id});
        if(!cart){
             return res.status(404).json({message:"cart inexistent this message should never occur ..."});
        }
        const cartCourses = cart.courses;
        if(!cartCourses.includes(courseId)){
            cartCourses.push(courseId);
        }
        await Cart.findByIdAndUpdate(cart._id,{
            courses:cartCourses
        });
        return res.status(200).json({message:"course added to the cart ",cartCourses});
    } catch (e) {
        return res.status(500).json({message:"internal server error"});
    }
}

export async function removeFromCart(req, res) {
    try {
        const user = req.user;
        const courseId = req.body.courseId;

        if (!user || !courseId) {
            return res.status(404).json({ message: "Missing fields: user or courseId" });
        }

        const cart = await Cart.findOne({ userId: user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart does not exist" });
        }

        const updatedCourses = cart.courses.filter(id => id.toString() !== courseId.toString());

        await Cart.findByIdAndUpdate(cart._id, {
            courses: updatedCourses
        });

        return res.status(200).json({ message: "Course removed from cart", cartCourses: updatedCourses });
    } catch (e) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getCartCourses(req, res) {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "Missing user information" });
        }

        const cart = await Cart.findOne({ userId: user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart does not exist" });
        }

        return res.status(200).json({ cartCourses: cart.courses });
    } catch (e) {
        return res.status(500).json({ message: "Internal server error" });
    }
}


export async function getMyCourses(req, res) {
  try {
    const user = req.user;

    const courses = await Promise.all(
      user.enrolledCourses.map(async (courseId) => {
        const course = await Course.findById(courseId)
          .select("_id name photoUrl description skills instructor") 
          .populate({
            path: "instructor",
            select: "name",
          });

        if (!course) return null;

        const courseObj = course.toObject();

        return {
          _id: courseObj._id,
          name: courseObj.name,
          photoUrl: courseObj.photoUrl,
          description: courseObj.description,
          skills: courseObj.skills,
          instructorName: courseObj.instructor?.name || "Unknown"
        };

      })
    );

    const filteredCourses = courses.filter(c => c !== null);

    return res.status(200).json({ courses: filteredCourses });
  } catch (e) {
    console.error("getMyCourses error:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}



