const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const request = require('request-promise-native');

const chat = io.of('/chat');

chat.use(async (socket, next) => {
  try {
    if (socket.handshake.headers.cookie) {
      const resp = await request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/api/authenticate.json',
        headers: {
          Cookie: socket.handshake.headers.cookie,
        },
      });
      console.log('resp', resp);
      next();
    }
  } catch (error) {
    console.log('error', error);
    // (err, response, body) => {
    //   if (response && response.statusCode === 204) {
    //     return next();
    //   }
    next(new Error('Authorization Error'));
    // }
  }
})


chat.on('connection', socket => {
  console.log('some one connected');
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



