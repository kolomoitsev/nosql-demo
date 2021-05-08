const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const bCrypt = require('bcrypt');

const { authenticateToken, updateTokens } = require('./../helpers/index');
const { secret } = require('./../config').jwt;

const tokenModel = require('./../models/token.model');
const userModel = require('./../models/user.model');

router
    //user auth
    .post('/login', async (req, res) => {
        const { userEmail, userPassword } = req.body;

        let user;

        try{
            user = await userModel.findOne({
                userEmail,
            });
        } catch (e){
            return res.status(404).json(e.message);
        }
        if (!user) {
            return res.sendStatus(404);
        }

        if ((await bCrypt.compare(userPassword, user.userPassword)) === false) {
            return res.sendStatus(401);
        } else {
            const { userEmail, _id } = user;

            updateTokens(_id).then((tokens) =>
                res.json({ tokens, userEmail, _id }),
            );
        }
    })
    //refresh tokens
    .post('/refresh', async (req, res) => {
        const { refreshToken } = req.body;

        let payload;

        try {
            payload = jwt.verify(refreshToken, secret);
            if (payload.type !== 'refresh') {
                return res.status(400).json({ message: 'Invalid token' });
            }
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                return res.status(400).json({ message: 'Token expired' });
            } else if (e instanceof jwt.JsonWebTokenError) {
                return res.status(400).json({ message: 'Invalid token' });
            }
        }

        tokenModel
            .findOne({ tokenId: payload.id })
            .exec()
            .then((token) => {
                if (token === null) {
                    throw new Error('Invalid token');
                }
                return updateTokens(token.userId);
            })
            .then((tokens) => res.json(tokens))
            .catch((err) => res.status(400).json({ message: err.message }));
    })
    //register user
    .post('/register',async (req, res) => {
        const {
            userName,
            userLastName,
            userEmail,
            userPhone,
            userPassword
        } = req.body;

        const user = new userModel({
            userName,
            userLastName,
            userEmail,
            userPhone,
            userPassword: await bCrypt.hash(userPassword, 10),
        });

        await user
            .save()
            .then(() => res.status(200).json(user))
            .catch((err) =>
                res.status(500).json({
                    error: 'Error with creating new user',
                    err,
                }),
            );
    })
    //get all users
    .get('/getAll', authenticateToken, async (req, res) => {
        try {
            const users = await userModel.find({})
                .select("-userPassword");

            if (users.length) {
                return res.status(200).json(users);
            } else {
                return res.status(404).json({
                    error: 'Not found',
                });
            }
        } catch (e) {
            return res.status(500).json({
                error: 'Error with finding users',
                e,
            });
        }
    })
    //edit user
    .put('/changePassword', authenticateToken, async (req, res) => {
        const {
            userEmail,
            userCurrentPassword,
            userNewPassword,
        } = req.body;

        try {
            const user = await userModel.findOneAndUpdate({
                userEmail: userEmail
            }, {
                userPassword: await bCrypt.hash(userNewPassword, 10),
            })
                .select("-userPassword");

            if (user) {
                return res.status(200).json(user);
            } else
                return res.status(404).json({
                    error: 'Not found',
                });
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                error: 'Error with updating exact user',
            });
        }
    })


module.exports = router;
