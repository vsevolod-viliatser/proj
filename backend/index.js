const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors")
const pool = require('./db')
// Middleware to parse JSON in the request body

app.use(bodyParser.json());
app.use(cors())
app.post('/newRec', async (req, res) => {
    try {
      const { name, value } = req.body;
      console.log(name, value);
  
      const newRecord = await pool.query('INSERT INTO users (name, value) VALUES ($1, $2)', [name, value]);
  
      // Send a success response to the client
      res.status(200).json({ message: 'Record inserted successfully' });
    } catch (error) {
      console.error(error);
  
      // Send an error response to the client
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.get('/leaderboard', async (req, res) => {
    try {
      const leaderboardData = await pool.query('SELECT name, value FROM users ORDER BY value DESC LIMIT 5');
      res.json(leaderboardData.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});