import express from 'express';
import JobsService from '../middleware/jobs.middleware.js';

const router = express.Router();

router.post('/create/:id', async (req, res) => {
    try {
        const result = await JobsService.createJob(req.body, req.params.id);
        
        res.json(result);
        
    } catch (error) {
        res.status(400).json({ message:error.message });
    }
});

router.post('/data-create/:id', async (req, res) => {
    try {
        const result = await JobsService.createData(req.body, req.params.id);
        
        res.json(result);
        
    } catch (error) {
        res.status(400).json({ message:error.message });
    }
});

router.get('/data-all/:id', async (req, res) => {
     try{
         const result=await JobsService.getAllData(req.params.id)
         res.json(result)
     }
     catch(error){
         res.status(400).json({message:error.message})
     }
})

router.get('/user-all-jobs', async (req,res)=>{
     try{
         const result=await JobsService.allJobs(req.cookies.access_token)
         res.json(result)
     }
     catch(error){
         res.status(400).json({message:error.message})
     }
})

export default router;
