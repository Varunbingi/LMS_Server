
import Course from "../Model/courseModel.js"
import AppError from "../utils/AppError.js"
import cloudinary from "cloudinary";
import fs from 'node:fs/promises'

const getAllCourses=async(req,res,next)=>{
    try{
        const courses=await Course.find({}).select('-lectures');
        res.status(200).json({
            success:true,
            message:"All courses",
            courses
        })
    }
    catch(e){
        return next(new AppError(e.message,500))
    }
}
const getLectureById=async (req,res,next)=>{
    try{
        const {courseId}=req.params;
        const course=await Course.findById(courseId);
        if(!course){
            return next(new AppError('Invalid course Id',400))
        }
        res.status(200).json({
            success:true,
            message:"Course fetched successfully",
            lectures:course.lectures,
        })
    }
    catch(e){
        return next(new AppError(e.message,500))
    }
    

}
const createCourse = async (req, res, next) => {
    try {
        const { title, description, category, createdBy } = req.body;

        if (!title || !description || !category || !createdBy) {
            return next(new AppError("All fields are required", 400));
        }

        const course = await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail: {
                public_id: "Dummy",
                secure_url: "Dummy"
            }
        });

        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms'
            });
            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }
            await fs.rm(req.file.path);

        }
        await course.save();
        res.status(200).json({
            success: true,
            message: "course create successfully",
            course
        });
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
};

const updateCourse=async(req,res,next)=>{
    const {courseId}=req.params;
    const course=await Course.findByIdAndUpdate(
        courseId,{
            $set:req.body
        },
        {
            runValidators:true,
            new: true
        }
    )
    if(!course){
        return next(new AppError("course deos not  exist",400))
    }
    
    res.status(200).json({
        success:true,
        message:"Course updated successfully",
        course
    })

}
const deleteCourse=async(req,res,next)=>{
    try{
        const {courseId}=req.params;
        const course=await Course.findById(courseId);
        if(!course){
            return next(new AppError("Course deost not exixt",500))
        }
        await Course.findByIdAndDelete(courseId)
        res.status(200).json({
            success:true,
            message:"Course deleted successfully"
        })
    }
    catch(e){
        return next(new AppError(e.message,500))
    }
}
const addLectureToCourseById=async(req,res,next)=>{
    try{
        const {title,description}=req.body;
        const {courseId}=req.params;
        console.log(title,description);
        if(!title||!description){
            return next(new AppError("All fileds are required",400))
        }
        const course=await Course.findById(courseId);
        if(!course){
            return next(new AppError("Course does not exist",400))
        }
        const lectureData={
            title,
            description,
            lecture:{}
        }
        if(req.file){
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                chunk_size:50000000,
                resource_type:"video"
            })
            if(result){
                lectureData.lecture.public_id=result.public_id;
                lectureData.lecture.secure_url=result.secure_url;
            }
            fs.rm(`uploads/${req.file.filename}`)
        }
        course.lectures.push(lectureData);
        course.numbersOflectures=course.lectures.length;
        await course.save();
        res.status(200).json({
            success:true,
            message:"lecture added successfully"
        })
    }
    catch(e){
        return next(new AppError(e.message,500))
    }

}

const removeLectureFromCourse=async(req,res,next)=>{
    try{
        const {courseId,lectureId}=req.query;
        console.log(lectureId);
        console.log(courseId);
        if(!courseId){
            return next(new AppError("course id is required",400))
        }
        if (!lectureId) {
            return next(new AppError('Lecture ID is required', 400));
        }
        const course=await Course.findById(courseId);
        
        const lectureIndex=course.lectures.findIndex(lecture=>lecture._id.toString()===lectureId.toString());
        if(lectureIndex === -1){
            return next(new AppError("lecture not found",404))
        }
        await cloudinary.v2.uploader.destroy(
            course.lectures[lectureIndex].lecture.public_id,
            {
              resource_type: 'video',
            }
          );
          course.lectures.splice(lectureIndex,1);
          course.numbersOflectures=course.lectures.length;
          await course.save();
          return res.status(200).json({
              status:"success",
              message:"lecture removed successfully"
          })
    }
    catch(e){
        return next(new AppError(e.message,500))
    }
   
}

export {
    getAllCourses,
    getLectureById,
    createCourse,
    updateCourse,
    deleteCourse,
    addLectureToCourseById,
    removeLectureFromCourse

}