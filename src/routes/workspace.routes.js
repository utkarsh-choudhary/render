import express from 'express';
import multer from 'multer';
import WorkspaceController from '../controllers/workspace.controller.js';

const router = express.Router();
const upload = multer({ dest: '/uploads' }); // Temporary storage location

router.post('/update-profile', upload.single('imageUrl'), WorkspaceController.updateProfile);

export default router;
