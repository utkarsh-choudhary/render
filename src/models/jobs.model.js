import mongoose from 'mongoose';

const JobsSchema = new mongoose.Schema({
    workspaceId: { type: String },
    training: { type: String },
    jobName: { type: String },
    experimentName: { type: String },
    description: { type: String },
    tags: { type: String },
    taskType: { type: String },
    dataSetType: { type: String },
    dataSetId: { type: String },
}, { timestamps:true });

const MlJobs = mongoose.model('MlJobs', JobsSchema);
export default MlJobs;
