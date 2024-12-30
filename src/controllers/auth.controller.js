import express from 'express';
import AuthService from '../middleware/auth.middleware.js';
import multer from 'multer';
import User from '../models/user.model.js';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = express.Router();
const upload = multer({ dest:'uploads/' }); // Temporary storage for uploaded files

router.post('/check', async (req, res) => {
    const { firebaseUID } = req.body;
    
    try {
        const existingUser = await User.findOne({ firebaseUID });
        
        if (existingUser) {
            return res.json({ exists: true });
        }
        
        return res.json({ exists: false });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});


router.post('/signup', async (req, res) => {
    const { email, displayName, firebaseUID, password } = req.body;
    const isSocialLogin = !password; // Determine if it's a social login

    // Validate required fields based on login type
    if (!email || !firebaseUID || (isSocialLogin && !displayName)) {
        return res.status(400).json({ message: 'Email, Firebase UID, and display name are required for social login.' });
    }

    try {
        const existingUser = await User.findOne({ firebaseUID });
        
        if (existingUser) {
            // Generate JWT for existing user
            const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
            return res.status(200).json({ message: 'User exists', token, user: existingUser });
        }

        // Hash the password only if it is not a social login
        const hashedPassword = isSocialLogin ? undefined : await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            displayName,
            firebaseUID,
            createdAt: new Date(),
            isSocialLogin
        });

        // Generate JWT for new user
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        console.log(token)

        return res.status(201).json({ message: 'User created successfully', token, user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Error creating user' });
    }
});





router.post('/login', async (req, res) => {
    try {
        const result = await AuthService.login(req.body);
        
        res.cookie('access_token', result.token, {
            httpOnly:true,
            secure:true,
            sameSite:'none',
        });
        
        res.json(result);
        
    } catch (error) {
        res.status(400).json({ message:error.message });
    }
});

router.post('/update-details', upload.single('imageUrl'), async (req, res) => {
    try {
        const token = req.cookies.access_token;
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const result = await AuthService.editProfile(req.body, req.file, token);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});


router.get('/get-details', async (req, res) => {
    try {
        const result = await AuthService.getDetails(req.cookies.access_token);
        
        res.json(result);
        
    } catch (error) {
        res.status(400).json({ message:error.message });
    }
});

router.delete('/delete-user/:id', async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// router.post("/social-login", async (req, res) => {
//     const { email, displayName, firebaseUID, password, isSocialLogin } = req.body;
  
//     try {
//       // Check if the user exists
//       let user = await User.findOne({ firebaseUID });
  
//       if (!user) {
//         // Create a new user
//         user = new User({
//           email,
//           password: password || null, // Provide a default value for password
//           displayName,
//           firebaseUID,
//           isSocialLogin: isSocialLogin || true,
//           createdAt: new Date(),
//         });
//         await user.save();
//       }
  
//       // Respond with success and user data
//       res.status(200).json({
//         success: true,
//         message: "User authenticated successfully.",
//         user,
//       });
//     } catch (error) {
//       console.error("Error during social login:", error);
//       res.status(500).json({
//         success: false,
//         message: "Internal server error. Please try again.",
//       });
//     }
//   });
  
  

export default router;
