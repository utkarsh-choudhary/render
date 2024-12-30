import { config } from 'dotenv';

config();

export const getConfig = () => {
    return {
        mongoURI: process.env.MONGO_URI,
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiresIn: process.env.JWT_EXPIRES,
    };
};
