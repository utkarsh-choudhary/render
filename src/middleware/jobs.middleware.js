import MlJobs from '../models/jobs.model.js';
import DataModel from '../models/data.model.js';
import WorkSpace from '../models/workspace.model.js';
import jwt from 'jsonwebtoken';

class JobsService {

    async createJob(body, id) {
        // Assuming body contains 'experimentOption' and 'experimentId' if selecting existing.
        if (body.experimentOption === 'existing' && !body.experimentId) {
            throw new Error('Experiment ID is required when selecting an existing experiment');
        }
    
        const newJob = await MlJobs.create({
            ...body,
            workspaceId: id,
            experimentId: body.experimentOption === 'existing' ? body.experimentId : undefined,
        });
    
        return newJob ?
            { message: 'created', success: true } :
            { message: 'Not created', success: false };
    }
    

  async createData(body, id) {
      const newData = await DataModel.create({ ...body, workspaceId:id });
      return newData ? 
          { message:'Data created successfully', success:true } :
          { message:'Data not created', success:false };
  }

  async getAllData(id) {
      const allData = await DataModel.find({ workspaceId:id });
      return allData.length ? 
          { allData, message:'see all data', success:true } :
          { message:'No data found', success:false };
  }

  async allJobs(userId) {
      const decoded = jwt.verify(userId, process.env.JWT_SECRET);
      const authorId = decoded.id;

      const userWorkSpace = await WorkSpace.find({ userId : authorId });
      if (!userWorkSpace.length) throw new Error('No workspaces found for the user');

      const workSpaceIds = userWorkSpace.map(workspace => workspace._id);
      
      const jobs = await MlJobs.find({ workspaceId:{ $in : workSpaceIds } });
      
      return jobs.length ? 
          { jobs, message:'Jobs retrieved successfully', success:true } :
          { message:'No jobs found', success:false };
  }
}

export default new JobsService();
