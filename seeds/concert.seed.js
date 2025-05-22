const mongoose = require('mongoose');
const Concert = require('../models/concert.model');

mongoose.connect('mongodb://0.0.0.0:27017/companyDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', async () => {
  try {
    await Concert.deleteMany();

    await Concert.insertMany([
      { performer: 'Rock Music Style', genre: 'Workshop', price: 25, day: 1, image: 'concert.jpg', workshop: 'Rock Music Style' },
      { performer: 'How to make you voice grooowl', genre: 'Workshop', price: 25, day: 1, image: 'concert.jpg', workshop: 'How to make you voice grooowl' },
      { performer: 'Make your voice stronger', genre: 'Workshop', price: 25, day: 1, image: 'concert.jpg', workshop: 'Make your voice stronger' },
      { performer: 'History of Rock', genre: 'Workshop', price: 25, day: 1, image: 'concert.jpg', workshop: 'History of Rock' },

      { performer: 'Find your real tune', genre: 'Workshop', price: 25, day: 2, image: 'concert.jpg', workshop: 'Find your real tune' },
      { performer: 'Find your real YOU', genre: 'Workshop', price: 25, day: 2, image: 'concert.jpg', workshop: 'Find your real YOU' },
      { performer: 'Fell the music', genre: 'Workshop', price: 25, day: 2, image: 'concert.jpg', workshop: 'Fell the music' },
      { performer: 'Jam session', genre: 'Workshop', price: 25, day: 2, image: 'concert.jpg', workshop: 'Jam session' },

      { performer: 'Increase your vocal range', genre: 'Workshop', price: 50, day: 3, image: 'concert.jpg', workshop: 'Increase your vocal range' },
      { performer: 'How to properly warmup before singing', genre: 'Workshop', price: 50, day: 3, image: 'concert.jpg', workshop: 'How to properly warmup before singing' },
      { performer: "It's time for YOU!", genre: 'Workshop', price: 50, day: 3, image: 'concert.jpg', workshop: "It's time for YOU!" }
    ]);

    console.log('✔ Concert seed data inserted');
  } catch (err) {
    console.error('❌ Error seeding concerts:', err);
  } finally {
    db.close();
  }
});
