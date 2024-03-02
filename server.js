// server.js file making server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path=require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection as Database
mongoose.connect('mongodb+srv://vinaykain2111:ia20R926bndF7pEU@cluster0.nge6q6z.mongodb.net/project0?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

//API Schema
const Schema = mongoose.Schema;
const dataSchema = new Schema({
  name: String,
  age: Number,
  email: String
});

const Data = mongoose.model('Data', dataSchema);

app.use(cors());
app.use(bodyParser.json());

// API endpoints for fetching
app.get('/data', async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Api endpoint Adding Data
app.post('/api/add', async (req, res) => {
  const newData = new Data(req.body);
  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Api endpoint for Updating Existing Data
app.put('/api/update/:id', async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
  
    try {
      const updatedData = await Data.findByIdAndUpdate(id, newData, { new: true });
      res.json(updatedData);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
// Count API endpoint
let addCount = 0;
let updateCount = 0;

app.get('/count', (req, res) => {
  res.json({ addCount, updateCount });
});

app.post('/count/add', (req, res) => {
  addCount++;
  res.json({ message: 'Add count incremented' });
});

app.post('/count/update', (req, res) => {
  updateCount++;
  res.json({ message: 'Update count incremented' });
});
//static files
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
//creating http server on Port 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
