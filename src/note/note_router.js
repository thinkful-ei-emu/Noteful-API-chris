const path = require('path');
const express = require('express');
const xss = require('xss');
const NoteService = require('../note_services');

const noteRouter = express.Router();
const jsonParser = express.json();

const serializeNotes = note => ({
  id: note.id,
  note_name: xss(note.note_name),
  date_modified: note.date_modified,
  folders_id: note.folders_id,
  content: xss(note.content)
});

noteRouter
  .route('/')
  .get((req, res, next) => {
    NoteService.getAllNotes(
      req.app.get('db')
    )
      .then(notes => res.json(notes.map(serializeNotes)));
  })
  .post(jsonParser, (req, res, next) => {
    const { id, note_name, date_modified,
      folders_id, content} = req.body;
    const newNote = { id, note_name, date_modified,
      folders_id, content };

    for (const [key, value] of Object.entries(newNote)) {
      if(value === null || value === '') {
        return res.status(400).json({
          error: { mesage: `Missing '${key}' in request body`}
        });
      }
    }
    NoteService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res.status(201)
          .location(path.posix.join(req.originalUrl + `/${note.id}`))
          .json(serializeNotes(note));
      })
      .catch(next);
  });

noteRouter
  .route('/:id')
  .all((req, res, next) => {
    NoteService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(note => {
        if(!note) {
          return res.status(404).json({
            error: { message: 'Note doesn\'t exist'}
          });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => res.json(serializeNotes(res.note)))
  .delete((req, res, next) => {
    NoteService.deleteNote(
      req.app.get('db'),
      req.params.id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { id, note_name, date_modified,
      folders_id, content} = req.body;
    const updateNote = { id, note_name, date_modified,
      folders_id, content };

    const numOfVals = Object.values(updateNote).filter(Boolean).length;
    if(numOfVals === 0) {
      return res.status(400).json({
        error: {
          message: 'Requset body must contain either a \'note name\', \'folder ID\', or \'content\''
        }
      });
    }

    NoteService.updateNote(
      req.app.get('db'),
      req.params.id,
      updateNote
    )
      .then(noteAff => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = noteRouter;