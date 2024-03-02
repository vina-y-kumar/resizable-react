

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/tournamentDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


const tournamentSchema = new mongoose.Schema({
  name: String,
  creator: String,
  winner: String,
  rooms: [{
    name: String,
    room:[{
        room_id:{
            type:Number
        },
        players:{
            name:String,
            score: Number
        }
        
    }],
    players: [{
      name: String,
      score: Number
    }]
  }]
});

const Tournament = mongoose.model('Tournament', tournamentSchema);

app.use(bodyParser.json());

app.post('/create', async (req, res) => {
  try {
    const { name, creator } = req.body;
    const tournament = new Tournament({ name, creator, rooms: [] });
    await tournament.save();
    res.status(201).json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/add-room/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { roomName } = req.body;
    const tournament = await Tournament.findById(id);
    tournament.rooms.push({ name: roomName, players: [] });
    await tournament.save();
    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/add-player/:id/:roomIndex', async (req, res) => {
  try {
    const { id, roomIndex } = req.params;
    const { playerName, score } = req.body;
    const tournament = await Tournament.findById(id);
    tournament.rooms[roomIndex].players.push({ name: playerName, score });
    await tournament.save();
    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/save-winner/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { winnerName } = req.body;
    const tournament = await Tournament.findById(id);
    tournament.winner = winnerName;
    await tournament.save();
    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/save-score/:id/:roomIndex/:playerIndex', async (req, res) => {
  try {
    const { id, roomIndex, playerIndex } = req.params;
    const { score } = req.body;
    const tournament = await Tournament.findById(id);
    tournament.rooms[roomIndex].players[playerIndex].score = score;
    await tournament.save();
    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
