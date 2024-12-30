import WorkSpace from '../models/workspace.model.js';
import jwt from 'jsonwebtoken';

class WorkspaceService {

  async create(body, userId) {
      const decoded = jwt.verify(userId, process.env.JWT_SECRET);
      
      const newWorkSpace = await WorkSpace.create({ ...body, userId : decoded.id });
      
      return newWorkSpace ? 
          { message:'Workspace Created Successfully', success:true } :
          { message:'Workspace not created', success:false };
  }

  async getWorkspace(userId) {
      const decoded = jwt.verify(userId, process.env.JWT_SECRET);
      
      return await WorkSpace.find({ userId : decoded.id });
  }
}

export default new WorkspaceService();
