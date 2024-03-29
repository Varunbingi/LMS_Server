import {Schema,model} from "mongoose";


const courseSchema=new Schema({
    title:{
        type:String,
        reuired:[true,'Title is required'],
        minLength:[7,"Title must be at least 8 char"],
        trim:true,
        maxLength:[40,"Tile must be less than 40 char"]
    },
    description:{
        type:String,
        reuired:[true,'Description is required'],
        minLength:[10,"Description must be at least 10 char"],
        trim:true,
        maxLength:[200,"Description must be less than 200 char"]
    },
    category:{
        type:String,
        required:[true,"Category is required"]
    },
    thumbnail:{
        public_id:{
            type:String,
            required:true,
        },
        secure_url:{
            type:String,
            required:true
        }
    },
    lectures:[{
        title:String,
        description:String,
        lecture:{
            public_id:{
                type:String,
                //   required:true,
            },
            secure_url:{
                type:String,
                //  required:true
            }
        }
    }],
    numbersOflectures:{
        type:Number,
        default:0
    },
    createdBy:{
        type:String,
        required:true
    }

},{
    timestamps:true,
}
);

const Course=new model('Course',courseSchema);

export default Course;