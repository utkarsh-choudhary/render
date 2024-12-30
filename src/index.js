import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './controllers/auth.controller.js';
import jobsRoutes from './controllers/jobs.controller.js';
import workspaceRoutes from './controllers/workspace.controller.js';
import { getConfig } from './config/config.js';

const app = express();
const config=getConfig();

app.use(cors({
    origin: "http://localhost:5173", // Adjust this to your frontend's URL
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true // Allow credentials to be sent with requests.
 }));
 
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use('/user', authRoutes); // Auth routes for signup/login/update/get details.
app.use('/jobs', jobsRoutes); // Job related routes.
app.use('/workspace', workspaceRoutes); // Workspace related routes.

mongoose.connect(config.mongoURI)
.then(() => console.log("MongoDB connection successfully!!"))
.catch(err => console.error("MongoDB connection error:", err));

app.listen(3000 , () => console.log("Server running on port 3000"));
