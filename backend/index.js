import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validatoins.js';
import { register, login, me, refresh } from './controllers/UserController.js';
import { createPost, getAll, getOne, remove, update, getLastTags } from './controllers/PostController.js';
import checkAuth from './utils/checkAuth.js';
import multer from 'multer';
import cors from 'cors';
import handleValidationErrors from './utils/handleValidationErrors.js';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv'

dotenv.config();
mongoose.connect(process.env.MONGO).then(() => {
    console.log('DB ok');
}).catch((err) => console.log("DB ERROR", err));

const app = express();
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });


app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));


app.post('/auth/register', registerValidation, handleValidationErrors, register);

app.post('/auth/login', loginValidation, handleValidationErrors, login);

app.get('/auth/me', checkAuth, me);


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/tags', getLastTags);
app.get('/posts', getAll);

app.get('/posts/tags', getLastTags);

app.get('/posts/:id', getOne);

// app.get('/refresh', refresh);  //token

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, createPost);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id', checkAuth, update);


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK");
})