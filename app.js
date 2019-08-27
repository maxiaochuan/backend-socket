const cookie = require('cookie');
const request = require('request-promise-native');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cookie: false,
});

io.use((socket, next) => {
  console.log('use cookie parse');
  if (socket.request.headers.cookie) {
    socket.request.cookies = cookie.parse(socket.request.headers.cookie);
  }
  next();
})



io.use(async (socket, next) => {
  console.log('use authorized');
  try {
    const resp = await request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/api/authenticate.json',
      headers: {
        Cookie: socket.handshake.headers.cookie,
      },
    });
    socket.user = resp;
    next();
  } catch (error) {
    // (err, response, body) => {
    //   if (response && response.statusCode === 204) {
    //     return next();
    //   }
    next(new Error('Not Authorized'));
    // }
  }
})

const users = new Map();

const chat = io.of('/chat');

chat.on('connection', socket => {
  console.log('some one connected', socket.id);
  const key = socket.request.cookies.Authorization;
  users.set(key, socket);
  if (!key) {
    console.error('!key');
    socket.disconnect(true);
  }
  // users.set()
  console.log('users.size', users.size);
  socket.on('chat message', msg => {
    chat.emit('chat message', msg);
  })
  socket.on('error', error => {
    console.log('on error', error);
  })
})

http.listen(3001, () => {
  console.log('listening on *:3001');
})



