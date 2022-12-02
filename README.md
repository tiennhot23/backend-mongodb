# url-shortener

__`General`__

- access shortlink
- create shortlink

__`User`__

- create account
- login/logout
- get stats
- create public/private shortlink
- delete shortlink
- disable account
- logout all current session

## Dependencies

### express-session

`connect.sid = 's:' + session_id + '.' + hash(session_id, secret)`

Ex: sid=s%3ARx9oeSsLraRwPSBb3gQdDw_JJc0yQoot.3YkY%2BYn2Ty4JV0nFQYRWvL0ttoPaoQR6eVb5ixmQOF4 (`%3A` is `:` character encode)

__`What secret used for?`__

- it used to protect against fake cookie data

__`Options`__

```js
cookie: {
  secret: SESSION_SECRET,
  name: SESSION_ID,
  saveUninitialized: false, // save a "uninitialized" session (new session but dont have data to save) to the store
  // save session to store even if the session was never modified,
  // set to false if the store has implement the `touch` method (RedisStore does)
  resave: false,
  cookie: {
    secure: false, // cookie can be sent only via HTTPS (app.set('trust proxy', 1) if use nodejs)
    httpOnly: true, // minimizes the risk of client-side scripts access cookie. `document.cookie`
  },
  store: new RedisStore({
    client: redis,
    url: REDIS_URL,
    ttl: SESSION_TTL, // second
  }),
  genid(req) {
    return yourGenSessionIDFunction(); // Provide a function that returns a session ID
  },
  /**
    * reset expiration to maxAge on every response
    * if saveUninitialized option is false, the cookie will not be set on a response with an uninitialized session.
    */
  rolling: true,
},

session.destroy(err => {}) // destroy session
session.save(err => {}) // save to store
session.touch() // reset expiration

session.id === req.sessionID // if sessionid sent from client is expired, it will store the new one. the expired sessionid can be archive by using session.cookie
session.cookie // cookie of requested client
session.cookie.maxAge // time remaining in milliseconds
session.cookie.originalMaxAge // original maxAge
```
