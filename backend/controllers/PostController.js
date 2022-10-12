import { json } from 'express';
import PostModel from '../models/Post.js';


export const getOne = async (req, res) => {
    try {
        const id = req.params.id;
        PostModel.findOneAndUpdate({
            _id: id
        },
            {
                $inc: { viewsCount: 1 }
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if (err) {
                    return res.status(400).json({
                        message: 'Не удалось вернуть статью',
                    });
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена',
                    });
                }
                res.json(doc);
            },
        ).populate('user');

    } catch (err) {
        return res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};


export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);
        res.json(tags);

    } catch (err) {
        return res.status(400).json({
            message: 'Не удалось получить статьи',
        });
    }
}


export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndDelete({
            _id: postId,
        }, (err, doc) => {
            if (err) {
                return res.status(400).json({
                    message: 'Не удалось удалить статью',
                });
            }
            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не удалена',
                });
            }
            return res.json({
                success: true,
            });
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getAll = async (req, res) => {
    try {

        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);

    } catch (err) {
        return res.status(400).json({
            message: 'Не удалось получить статьи',
        });
    }
};


export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne({
            _id: postId,
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.body.user,
            tags: req.body.tags,
        });
        res.json({
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Не удалось обновить статьи',
        });
    }
};



export const createPost = async (req, res) => {
    try {
        //body - это то,что нам передает пользователь
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });
        const post = await doc.save();

        res.json(post);
    } catch (err) {
        return
        res.status(500).json({
            message: 'Не удалось создать пост',
        });
    };
}