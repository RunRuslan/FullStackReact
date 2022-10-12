import mongoose from 'mongoose';


const TokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    }
});

export default mongoose.model('Token', TokenSchema);