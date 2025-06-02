import mongoose from "mongoose";
import { Lesson } from "./Course";

const newQuizSchema = mongoose.Schema({
    LessonId:{
        type:String,
        required:true,
    },


    theoryQuestions:{
        type:[String],
    },
    theoryAnswers:{
        type:[String],
        default:[]
    },


    MCQs:{
        type:[String]
    },
    McqOpts:{
        type:[[String]]
    },
    McqAnswers:{
        type:[Number],
        default:[]
    }
});
export default mongoose.model('Quiz',newQuizSchema);
