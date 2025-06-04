import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/payment.js"
import User from "../models/user.js"
import { Course } from "../models/Course.js";

import dotenv from 'dotenv'
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RazorPay_Key,
  key_secret: process.env.RazorPay_Secret,
});

export const createPayment = async (req, res) => {
  try {
    const { price, userId, courseId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const amountInPaise = price * 100;

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: { userId, courseId },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};



export const verifyPaymentAndEnroll = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      courseId,
      price,
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RazorPay_Secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const newPayment = new Payment({
      user: userId,
      course: courseId,
      price,
      order_id: razorpay_order_id,
    });

    await newPayment.save();
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({message:"user not found ",success:false});
    }
    
    const enrolledCourses = user.enrolledCourses;
    await User.findByIdAndUpdate(userId,{
      enrolledCourses:enrolledCourses
    })

    res.status(200).json({ success: true, payment: newPayment });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "payment Failed . in case money is debited from your bank our admins will make sure sending it back to you" });
  }
};
