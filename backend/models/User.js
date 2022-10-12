import mongoose from 'mongoose';


/*если мы хотим указать, что есть какой-то тип и обязательный 
  для заполнения,то передаем ОБЪЕКТ ,если это свойство необязателбьно ,то передаем ТИП*/


const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
}, {
    timestamps: true,
});

export default mongoose.model('User', UserSchema);