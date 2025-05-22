const express = require('express');
const cors = require('cors');
const path = require('path');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const testimonialsRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const app = express();

app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE'
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/client/build')));

mongoose.connect('mongodb+srv://mstalmach:zf9QoZv3r64pObkM@cluster0.amwpric.mongodb.net/NewWaveDB?retryWrites=true&w=majority&appName=Cluster0');
const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', err => console.log('Error ' + err));

let server = null;
if (require.main === module) {
  server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000');
  });

  const io = socketIo(server);

  io.on('connection', async (socket) => {
    console.log('New socket!');
    const Seat = require('./models/seat.model');
    try {
      const seats = await Seat.find();
      socket.emit('seatsUpdated', seats);
    } catch (error) {
      console.log('Error retrieving seats: ' + error.message);
    }
  });

  app.use((req, res, next) => {
    req.io = io;
    next();
  });
}

app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/concerts', concertsRoutes);
app.use('/api/seats', seatsRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

module.exports = app;
