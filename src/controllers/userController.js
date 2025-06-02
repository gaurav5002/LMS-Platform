import { Course, Lesson } from "../models/Course";
import mongoose from "mongoose";
import User from "../models/user";
import UserProgress from "../models/UserProgress";
import Discussions from "../models/Discussions";
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
        await Discussions.create({courseId:newCourse._id});

        return res.json({message:"course created succesfully ",newCourse});
    } catch (e) {
        return res.status(500).json({message:"internalServerError",e});
    }
}

export async function  addLesson(req,res) {
    try {
        const courseId = req.courseId;
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
        const course = Course.findById(req.courseId);
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
        const courseId = req.courseId;
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
        const courseId = req.courseId;
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



export async function updateProgress(req,res){

}


export async function getProgress(req,res){

}
