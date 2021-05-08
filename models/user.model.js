const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
    {
        userName: {
            type: String,
            required: true
        },
        userLastName: {
            type: String,
            required: true
        },
        userEmail: {
            type: String,
            unique: true,
            required: true
        },
        userPhone: {
            type: String,
            unique: true,
            required: true
        },
        userPassword: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    },
);

const UserModel = new mongoose.model('User', User);

module.exports = UserModel;
