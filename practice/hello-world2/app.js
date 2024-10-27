const express = require('express');
const indexRouter = require('./routes/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', indexRouter);

app.use((req, res, next) => { res.status(404).send('Not Found');0 });

app.use((err, req, res, next) => { res.status(err.status || 500); res.json({ type: 'error', status: err.status, message: err.message,stack: req.app.get('env') === 'development' ? err.stack : undefined }) });

module.exports = app; 