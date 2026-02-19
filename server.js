const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing MONGODB_URI");
let rotaCollection;

// Sample household chores for random assignment
const HOUSEHOLD_CHORES = [
  'Vacuuming',
  'Mopping',
  'Dishes',
  'Laundry',
  'Dusting',
  'Bathroom Cleaning',
  'Kitchen Cleaning',
  'Trash Removal',
  'Window Washing',
  'Yard Work',
  'Sweeping',
  'Organizing',
  'Meal Prep',
  'Groceries'
];

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('sample_store');
    rotaCollection = db.collection('rota');
    console.log('✓ Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

// API Routes

// GET all available chores
app.get('/api/chores', (req, res) => {
  res.json(HOUSEHOLD_CHORES);
});

// GET all rota items
app.get('/api/rota', async (req, res) => {
  try {
    const items = await rotaCollection.find({}).sort({ date: -1 }).toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new rota item
app.post('/api/rota', async (req, res) => {
  try {
    const { name, duties, date } = req.body;
    
    if (!name || !duties || duties.length === 0) {
      return res.status(400).json({ error: 'Name and duties are required' });
    }

    const newItem = {
      name,
      duties,
      date: new Date(date),
      createdAt: new Date()
    };

    const result = await rotaCollection.insertOne(newItem);
    res.status(201).json({ _id: result.insertedId, ...newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET random chore
app.get('/api/random-chore', (req, res) => {
  const randomChore = HOUSEHOLD_CHORES[Math.floor(Math.random() * HOUSEHOLD_CHORES.length)];
  res.json({ chore: randomChore });
});

// DELETE rota item
app.delete('/api/rota/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const result = await rotaCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
