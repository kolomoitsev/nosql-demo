const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Note = new Schema(
    {
        noteName: {
            type: String,
            required: true,
            unique: true,
        },
        noteTitle: {
            type: String,
            required: true,
        },
        noteSubtitle: {
            type: String,
            required: false,
        },
        noteDescription: {
            type: String,
            required: false,
        },
        noteListItem: {
            type: [[String]],
            required: false,
        },
        nodeAuthor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

    },
    {
        timestamps: true,
    },
).index({
    'noteTitle':'text',
    'noteDescription':'text'
});

const UserModel = new mongoose.model('Note', Note);

module.exports = UserModel;
