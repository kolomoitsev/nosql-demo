const express = require('express');
const router = express.Router();
const noteModel = require('./../models/note.model');
const {authenticateToken} = require("../helpers");

router
    .get('/get/:id', authenticateToken, async(req, res) => {
        const { id } = req.params;

        try {
            const note = await noteModel.findById(id);
            if (note) {
                return res.status(200).json(note);
            } else
                return res.status(404).json({
                    error: 'Not found',
                });
        } catch (e) {
            return res.status(500).json({
                error: 'Error with finding exact note',
            });
        }

    })

    .get('/getByUserId/:id', authenticateToken, async (req, res) => {
        const {id} = req.params;

        try {
            const notes = await noteModel.find({
                nodeAuthor: id
            });
            if (notes.length) {
                return res.status(200).json(notes);
            } else
                return res.status(404).json({
                    error: 'Not found',
                });
        } catch (e) {
            return res.status(500).json({
                error: 'Error with finding notes',
            });
        }

    })

    .post('/add', authenticateToken,async (req, res) => {
        const {
            noteName,
            noteTitle,
            noteSubtitle,
            noteDescription,
            noteListItem,
            nodeAuthor
        } = req.body;

        const note = new noteModel({
            noteName,
            noteTitle,
            noteSubtitle,
            noteDescription,
            noteListItem,
            nodeAuthor
        })

        await note
            .save()
            .then(() => res.status(200).json(note))
            .catch((err) =>
                res.status(500).json({
                    error: 'Error with creating new note',
                    err,
                }),
            );

    })

    .put('/edit', authenticateToken, async (req, res) => {

        const {
            id,
            noteTitle,
            noteDescription
        } = req.body;

        try {
            const note = await noteModel.findByIdAndUpdate(id, {
                noteTitle,
                noteDescription
            });

            if (note) {
                return res.status(200).json({message: "Updated"});
            } else
                return res.status(404).json({
                    error: 'Not found',
                });
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                error: 'Error with updating exact note',
            });
        }

    })

    .get('/search/:query', async (req, res) => {
        const { query } = req.params;

        try {
            const notes = await noteModel.find({
                '$text':{'$search': query}
            });
            if (notes) {
                return res.status(200).json(notes);
            } else
                return res.status(404).json({
                    error: 'Not found',
                });
        } catch (e) {
            return res.status(500).json({
                error: 'Error with finding notes',
            });
        }


    })

    .delete('/delete/:id', async(req, res) => {

        const { id } = req.params;
        try {
            const remove = await noteModel.findByIdAndDelete(id);
            if (remove) {
                return res.status(200).json({
                    message: 'Successfully deleted',
                });
            } else {
                return res.status(404).json({
                    error: 'Not found',
                });
            }
        } catch (e) {
            return res.status(500).json({
                error: 'Error with deleting exact note',
            });
        }

    })

module.exports = router;
