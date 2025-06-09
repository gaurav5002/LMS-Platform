import { Course } from "../models/Course";
import User from "../models/user";

export async function getIncome(req,res){
    try {
        let income = 0;
        const courses = await Course.find();
        for(let i=0;i<courses.length;i++){
            income += courses[i].totalEnrolledStudents * courses[i].price;
        }
        return res.status(200).json({success:true,message:"total income retrieved",income});
    } catch (e) {
        return res.status(500).json({success:false,message:"internal server error",income:-1});
    }
}


export async function  getNoOfInstructors(req,res) {
    try {
        const noOfInstructors = await User.countDocuments({role:"instructor"});
        return res.status(200).json({success:true,message:"fetched",noOfInstructors}) 
    } catch (e) {
        return res.status(500).json({success:false,message:"internal server error",noOfInstructors:-1});
    }
}

export async function getNoOfStudents(req,res) {
    try {
        const noOfStudents = await User.countDocuments({role:"user"});
        return res.status(200).json({success:true,message:"fetched",noOfStudents}) ;
    } catch (e) {
        return res.status(500).json({success:false,message:"internal server error",noOfStudents:-1});
    }
}