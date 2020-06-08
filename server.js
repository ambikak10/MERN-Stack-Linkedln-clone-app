const express = require('express');
const app = express();
const connectDB = require('./config/db');


//connect database
connectDB();

//Body Parser
app.use(express.json({extended: false}));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port 
${PORT}`));

app.get('/', (req, res) => res.send('API Running'));

//define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/profile'));

