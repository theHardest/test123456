require('./utils/env');
const express = require('express');
const path = require('path');
const app = express();
// const cors = require('cors');
// app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

const responseFormatter = require('./middleware/responseFormatter');
app.use(responseFormatter);

const logMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
app.use(logMiddleware);

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/webhook', function (req, res) {
  const exec = require('child_process').exec;
  exec('sh webhook.sh', (error, stdout, stderr) => {
    console.log(`${stdout}`);
    console.log(`${stderr}`);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });
  res.send('webhook');
});
app.use(function (req, res) {
  res.error('404 not found', 404);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log('ERROR:', err);
  res.error('500 - Internal Sever Error 請洽系統管理員', 500);
});

const port = process.env.PORT || 9000;

app.listen(port, async function () {
  console.log('listening on ' + 'http://localhost:' + port);
});
