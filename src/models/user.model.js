import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            // Password is required if `isSocialLogin` is false or undefined
            return !this.isSocialLogin;
        },
    },
    displayName: {
        type: String,
        required: function () {
            // DisplayName is required if `isSocialLogin` is true
            return this.isSocialLogin;
        },
    },
    isSocialLogin: {
        type: Boolean,
        // default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
UserSchema.pre('save', function(next) {
    if (this.isSocialLogin && !this.displayName) {
        return next(new Error('Display name is required for social logins.'));
    }

    if (!this.isSocialLogin && !this.password) {
        return next(new Error('Password is required for regular logins.'));
    }

    next();
});


const User = mongoose.model('User', UserSchema);
export default User;
