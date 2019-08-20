const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const request = require('request').defaults({ jar: true });

io.use((socket, next) => {
  const jar = request.jar();
  console.log(socket.handshake.headers.cookie);
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

io
  .of('/socket/chat')
  .on('connection', socket => {
    socket.on('chat message', d => {
      console.log('123', d);
    })
    socket.on('error', error => {
      console.log('on error', error);
    })
  })

http.listen(3001, () => {
  console.log('listening on *:3001');
})



