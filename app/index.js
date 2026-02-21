
import express from 'express';
import register from './routes/api/register.js';
import login from './routes/api/login.js';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/register', register);
app.post('/api/login', login);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
});
