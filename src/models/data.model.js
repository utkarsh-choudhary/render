import mongoose from 'mongoose';

const DataModelSchema = new mongoose.Schema({
    workspaceId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dataType: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const DataModel = mongoose.model('DataModel', DataModelSchema);
export default DataModel;
