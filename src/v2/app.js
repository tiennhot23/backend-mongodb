/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
require('./datatbase');
const express = require('express');
const { linkRouter, userRouter, baseRouter } = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', userRouter);
app.use('/get-link', linkRouter);
app.use('/', baseRouter);

app.use('/', async (req, res) => {
  res.send('404 Page');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
