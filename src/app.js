const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

const { NODE_ENV } = require('./config');
const noteRouter = require('./note/note_router');
const folderRouter = require('./folder/folder_router');

const morganOption = (NODE_ENV === 'production')
  ? 'common'
  : 'tiny';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/folders', folderRouter);

app.use('/api/notes', noteRouter);

app.get('/', (req, res) => {
  res.send('Hello, Noteful!');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;