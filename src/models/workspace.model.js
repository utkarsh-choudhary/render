import mongoose from 'mongoose';

const WorkspaceSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        ref : 'User',
        required : true 
    },
    name : {
        type : String,
        required : true 
    },
    subscription : {
        type : String,
        required : true 
    },
    group : {
        type : String,
        required : true 
    },
    region : {
        type : String,
        required : true 
    }
}, { timestamps:true });

const WorkSpace = mongoose.model('WorkSpace', WorkspaceSchema);
export default WorkSpace;
