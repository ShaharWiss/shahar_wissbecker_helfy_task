const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const app = express();
const port = 4000;

app.use(cors());

app.use(express.json());

app.use('/api/tasks', taskRoutes);

app.listen(port, ()=> {
    console.log(`Helfy project backend listening on port ${port}`);
});