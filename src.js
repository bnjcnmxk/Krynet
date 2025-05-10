// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(helmet());
app.use(express.json());

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('message', msg => {
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('Krynet API Live');
});

server.listen(3001, () => console.log('Server running on port 3001'));
