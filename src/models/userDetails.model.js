import mongoose from 'mongoose';

const UserDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
}, { timestamps: true });

const UserDetails = mongoose.model('UserDetails', UserDetailsSchema);
export default UserDetails;
