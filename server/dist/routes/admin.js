"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { authenticateJwt, SECRET } = require("../middleware/auth");
const { Course, Admin } = require("../db");
const zod_1 = require("zod");
const signupInput = zod_1.z.object({
    username: zod_1.z.string().min(10).max(50).email(),
    password: zod_1.z.string().min(6).max(15)
});
const loginInput = zod_1.z.object({
    username: zod_1.z.string().min(10).max(50).email(),
    password: zod_1.z.string().min(6).max(15)
});
//  type SignupParams = z.infer<typeof signupInput>;
const router = express_1.default.Router();
router.get("/me", authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["userId"];
    const admin = yield Admin.findOne({ _id: userId });
    if (!admin) {
        res.status(403).json({ msg: "Admin doesnt exist" });
        return;
    }
    res.json({
        username: admin.username
    });
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let parsedInput = signupInput.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(403).json({ msg: "error" });
    }
    const username = parsedInput.data.username;
    const password = parsedInput.data.password;
    const admin = yield Admin.findOne({ username: parsedInput.data.username });
    if (admin) {
        res.json({ message: 'Admin already exists' });
    }
    else {
        const newAdmin = new Admin({ username, password });
        yield newAdmin.save();
        const token = jsonwebtoken_1.default.sign({ id: newAdmin._id }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Admin created successfully', token });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.headers;
    const admin = yield Admin.findOne({ username, password });
    if (admin) {
        const token = jsonwebtoken_1.default.sign({ id: admin._id }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    }
    else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
}));
router.post('/courses', authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = new Course(req.body);
    yield course.save();
    res.json({ message: 'Course created successfully', courseId: course.id });
}));
router.put('/courses/:courseId', authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
        res.json({ message: 'Course updated successfully' });
    }
    else {
        res.status(404).json({ message: 'Course not found' });
    }
}));
router.get('/courses', authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield Course.find({});
    res.json({ courses });
}));
router.get('/course/:courseId', authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    const course = yield Course.findById(courseId);
    res.json({ course });
}));
exports.default = router;
