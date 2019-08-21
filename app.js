const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const request = require('request').defaults({ jar: true });

const chat = io.of('/socket/chat');

chat.use((socket, next) => {
  if (!socket.handshake.headers.cookie) {
    return next(new Error('Authorization Error'));
  }
  const jar = request.jar();
  const cookie = request.cookie(socket.handshake.headers.cookie);
  jar.setCookie(cookie, 'http://127.0.0.1:3000');
  request({
    method: 'POST',
    uri: 'http://127.0.0.1:3000/api/check.json',
    jar,
  }, (err, response, body) => {
    if (response && response.statusCode === 204) {
      return next();
    }
    return next(new Error('Authorization Error'));
  });
})


chat.on('connection', socket => {
  socket.on('chat message', msg => {
    console.log('on chat message', msg);
    chat.emit('chat message', msg);
  })
  socket.on('error', error => {
    console.log('on error', error);
  })
})

http.listen(3001, () => {
  console.log('listening on *:3001');
})



