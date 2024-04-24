import { Router } from "express";
import { addLectureToCourseById, createCourse, deleteCourse, getAllCourses, getLectureById, removeLectureFromCourse, updateCourse } from "../Controllers/courseController.js";
import { authorizedRoles, authorizedSubscriber, isLoggedIn } from "../Middleware/authMiddleware.js";
import upload from "../Middleware/multerMiddleware.js";

const courseRouter=Router();
courseRouter.route('/')
.get(isLoggedIn,getAllCourses)
.post(isLoggedIn,authorizedRoles('ADMIN') ,upload.single('thumbnail'), createCourse).delete(isLoggedIn, authorizedRoles('ADMIN'), removeLectureFromCourse);
courseRouter.
route("/:courseId")
.get(isLoggedIn, authorizedSubscriber,getLectureById)
.put(isLoggedIn,authorizedRoles('ADMIN'),updateCourse)
.delete(isLoggedIn,authorizedRoles('ADMIN'),deleteCourse).post( isLoggedIn,authorizedRoles("ADMIN"),
upload.single('lectures'), addLectureToCourseById)

export default courseRouter;