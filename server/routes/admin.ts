import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const { authenticateJwt, SECRET } = require("../middleware/auth");
const { Course, Admin } = require("../db");


const router = express.Router();

router.get("/me", authenticateJwt, async (req: Request, res: Response) => {
  const userId = req.headers["userId"];
    const admin = await Admin.findOne({ _id: userId });
    if (!admin) {
      res.status(403).json({msg: "Admin doesnt exist"})
      return
    }
    res.json({
        username: admin.username
    })
});

router.post('/signup', async (req: Request, res: Response) => {
  const {username, password} = req.body;
  const admin = await Admin.findOne({username});
  if(admin){
    res.json({message:'Admin already exists'});
  } else {
    const newAdmin = new Admin({username,password})
    await newAdmin.save();
    const token = jwt.sign({id: newAdmin._id},SECRET, {expiresIn:'1h'});
    res.json({message: 'Admin created successfully', token})
  }
  });
  
  router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.headers;
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      const token = jwt.sign({ id: admin._id }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });
  
  router.post('/courses', authenticateJwt, async (req: Request, res: Response) => {
    const course = new Course(req.body);
    await course.save();
    res.json({ message: 'Course created successfully', courseId: course.id });
  });
  
  router.put('/courses/:courseId', authenticateJwt, async (req: Request, res: Response) => {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
      res.json({ message: 'Course updated successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  });
  
  router.get('/courses', authenticateJwt, async (req: Request, res: Response) => {
    const courses = await Course.find({});
    res.json({ courses });
  });
  
  router.get('/course/:courseId', authenticateJwt, async (req: Request, res: Response) => {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    res.json({ course });
  });

  export default router;
