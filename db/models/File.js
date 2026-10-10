import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    path: { type: String, required: true },
    originalname: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    password: {
        type: String,
        required: true
    },
});

export default mongoose.model('File', fileSchema);