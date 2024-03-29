import { Router } from "express";
import { addLectureToCourseById, createCourse, deleteCourse, getAllCourses, getLectureById, updateCourse } from "../Controllers/courseController.js";
import { authorizedRoles, isLoggedIn } from "../Middleware/authMiddleware.js";
import upload from "../Middleware/multerMiddleware.js";

const courseRouter=Router();
courseRouter.route('/')
.get(isLoggedIn,getAllCourses)
.post(isLoggedIn,authorizedRoles('ADMIN') ,upload.single('thumbnail'), createCourse);
courseRouter.
route("/:courseId")
.get(isLoggedIn, getLectureById)
.put(isLoggedIn,authorizedRoles('ADMIN'),updateCourse)
.delete(isLoggedIn,authorizedRoles('ADMIN'),deleteCourse).post( isLoggedIn,authorizedRoles("ADMIN"),
upload.single('lectures'), addLectureToCourseById);


export default courseRouter;