import express from 'express';
import WorkspaceService from '../middleware/workspace.middleware.js';

const router = express.Router();

router.post('/create', async (req,res)=>{
     try{
         const result=await WorkspaceService.create(req.body , req.cookies.access_token)
         res.json(result)
     }
     catch(error){
         res.status(400).json({message:error.message})
     }
})

router.get('/all-workspace' ,async(req,res)=>{
     try{
         const result=await WorkspaceService.getWorkspace(req.cookies.access_token)
         res.json(result)
     }
     catch(error){
         res.status(400).json({message:error.message})
     }
})

export default router;
