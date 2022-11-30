/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
require('./database/mongo');
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const { createClient } = require('redis');
const { linkRouter, userRouter, baseRouter } = require('./routes');

const redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: true, //
    secret: 'secretkey',
    resave: false, // reset cookie per request,
    cookie: { secure: false },
  }),
);

app.use('/user', userRouter);
app.use('/link', linkRouter);
app.use('/', baseRouter);

app.use('/', async (req, res) => {
  res.send('404 Page');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
