const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Configure CORS to allow specific client origins. Add additional origins
// via the CLIENT_URL env var or by extending the list below.
const allowedOrigins = [
  process.env.CLIENT_URL, 
  'https://task-management-1-wioc.onrender.com'
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests like curl/postman (no origin)
      if (!origin) return callback(null, true)
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true)
      }
      return callback(new Error('CORS policy: This origin is not allowed'))
    }
  })
)
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => res.send({ status: 'ok', service: 'task-backend' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
