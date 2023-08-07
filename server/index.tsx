import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import adminRouter from "./routes/admin";
import userRouter from "./routes/user";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRouter)
app.use("/user", userRouter)


// Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
mongoose.connect('mongodb+srv://semleankur:H4E0brZsHzWzki13@cluster0.lo7ookf.mongodb.net/courses', { dbName: "courses" });

app.listen(3000, () => console.log('Server running on port 3000'));
