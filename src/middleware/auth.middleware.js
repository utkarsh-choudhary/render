import User from '../models/user.model.js';
import UserDetails from '../models/userDetails.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary.config.js';

class AuthService {
    
  async register(signupDTO) {
      const { email, password } = signupDTO;

      if (!password) throw new Error('Password is required');

      const hashedPassword = await bcrypt.hash(password, 10);
      const userCreated = await User.create({ email, password: hashedPassword });

      return userCreated ? 
          { message:'User Created successfully', success:true } :
          { message:'User not created', success:false };
  }

  async login(loginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const validUser = await User.findOne({ email });
    if (!validUser) {
        return { token: null, message: 'User not found', success: false };
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, validUser.password);
    if (!isPasswordValid) {
        return { token: null, message: 'Invalid password', success: false };
    }

    // Generate JWT token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    
    return {
        token,
        userDetails: { email: validUser.email, displayName: validUser.displayName || "No Name" },
        message: 'User signed in successfully',
        success: true
    };
}



  async editProfile(detailsDTO, file, userId) {
      const decodedToken = jwt.verify(userId, process.env.JWT_SECRET);
      const authorId = decodedToken.id;

      let imageSrc;
      if (file) {
          const uploadImage = await cloudinary.v2.uploader.upload(file.path, {
              folder:'user-profiles',
          });
          imageSrc = uploadImage.secure_url;
      }

      let presentProfile = await UserDetails.findOne({ userId : authorId });
      
      if (presentProfile) {
          presentProfile.firstName = detailsDTO.firstName || presentProfile.firstName;
          presentProfile.lastName = detailsDTO.lastName || presentProfile.lastName;
          presentProfile.address = detailsDTO.address || presentProfile.address;
          presentProfile.phone = detailsDTO.phone || presentProfile.phone;
          presentProfile.email = detailsDTO.email || presentProfile.email;
          if (imageSrc) presentProfile.imageUrl = imageSrc;

          await presentProfile.save();
        //   console.log(presentProfile)
          return { message:'User updated successfully', success:true };
      } else {
          if (!detailsDTO.firstName || !detailsDTO.lastName || !detailsDTO.address || !detailsDTO.phone || !detailsDTO.email || !imageSrc) {
              throw new Error('All fields are required to create');
          }

          await UserDetails.create({
              userId : authorId,
              email : detailsDTO.email,
              firstName : detailsDTO.firstName,
              lastName : detailsDTO.lastName,
              address : detailsDTO.address,
              phone : detailsDTO.phone,
              imageUrl : imageSrc // Assign the uploaded image URL 
          });

          return { message:'User profile created successfully', success:true };
      }
  }

  async getDetails(userId) {
    const decodedToken = jwt.verify(userId, process.env.JWT_SECRET);
    const authorId = decodedToken.id;
    console.log(authorId)
    const userProfile = await UserDetails.findOne({ userId : authorId });
    console.log(userProfile)
    
    // Get user info from User model to check social login status
    const user = await User.findById(authorId);

    return {
        ...userProfile,
        isSocialLogin: user.isSocialLogin,
        email: user.email,
        address:user.address,
        phone:user.phone
    };
}

  
  
}


export default new AuthService();
