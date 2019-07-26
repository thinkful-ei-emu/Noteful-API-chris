const path = require('path');
const express = require('express');
const xss = require('xss');
const FolderService = require('../folder_services');

const folderRouter = express.Router();
const jsonParser = express.json();

const serializeFolder = folder => ({
  id: folder.id,
  folder_name: xss(folder.folder_name),
});

folderRouter
  .route('/')
  .get((req, res, next) => {
    FolderService.getAllFolders(
      req.app.get('db')
    )
      .then(folders => res.json(folders.map(serializeFolder)));
  })
  .post(jsonParser, (req, res, next) => {
    const { id, folder_name } = req.body;
      
    if(!folder_name) {
      return res.status(400).json({
        error: { message: 'Missing the folder_name in the request body' }
      });
    }
    const newFolder = { id, folder_name };
    FolderService.insertFolder(
      req.app.get('db'),
      newFolder
    )
      .then(folder => {
        res.status(201)
          .location(path.posix.join(req.originalUrl + `/${folder.id}`))
          .json(serializeFolder(folder));
      })
      .catch(next);
  });

folderRouter
  .route('/:id')
  .all((req, res, next) => {
    FolderService.getById(
      req.app.get('db'),
      req.params.id 
    )
      .then(folder => {
        if(!folder) {
          return res.status(404).json({
            error: { message: 'Folder doesn\'t exist' }
          });
        }
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeFolder(res.folder));
  })
  .delete((req, res, next) => {
    FolderService.deleteFolder(
      req.app.get('db'),
      req.params.id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;
    const folderToUpdate = { folder_name };

    const numOfVals = Object.values(folderToUpdate).filter(Boolean).length;
    if(numOfVals === 0) {
      return res.status(400).json({
        error: {
          message: 'Request body must contain a \'folder name\''
        }
      });
    }

    FolderService.updateFolder(
      req.app.get('db'),
      req.params.id,
      folderToUpdate
    )
      .then(folAff => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = folderRouter;