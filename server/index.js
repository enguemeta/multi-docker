const keys = require('./keys');
const redis = require('redis');
const { Pool } = require('pg');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Postgre client setup

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on('error', () => console.error('Lost Postgres connection'));

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch((err) => console.error(err));

// Redis client setup

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

// Express

app.get('/', (req, res) => {
  res.send('Hi');
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values');
  res.send(values.rows);
});

app.get('/values/currrent', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const index = req.body.index;
  if (parseInt(index) > 40) {
    return res.status(422).json({ message: 'Index is too high' });
  }

  redisClient.hset('values', index, 'Notthing yet');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log('Listening');
});
