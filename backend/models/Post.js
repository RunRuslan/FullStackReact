import mongoose from 'mongoose';


/*если мы хотим указать, что есть какой-то тип и обязательный 
  для заполнения,то передаем ОБЪЕКТ ,если это свойство необязателбьно ,то передаем ТИП*/


const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        unique: true,
    },
    tags: {
        type: Array,
        defaut: [],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: String,
}, {
    timestamps: true,
});

export default mongoose.model('Post', PostSchema);