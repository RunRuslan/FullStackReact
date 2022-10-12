import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';
import jwt from 'jsonwebtoken'
import handleValidationErrors from '../utils/handleValidationErrors.js';

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        }, 'secret12', {
            expiresIn: '100d',
        },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        }
        );
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }
        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret12',
            {
                expiresIn: '30m',
            },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        });
    }
};



export const me = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        };

        const { passwordHash, ...userData } = user._doc;

        res.json(userData);

    } catch (err) {
        res.status(500).json({
            message: 'Нет доступа (me)',
        });
    }
};

export const logout = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        };

        const { passwordHash, ...userData } = user._doc;

        res.json(userData);

    } catch (err) {
        res.status(500).json({
            message: 'Нет доступа (me)',
        });
    }
};

export const refresh = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        };

        const { passwordHash, ...userData } = user._doc;

        res.json(userData);

    } catch (err) {
        res.status(500).json({
            message: 'Нет доступа (me)',
        });
    }
};
