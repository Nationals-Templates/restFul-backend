const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/userRoutes')
const setupSwagger = require('./swagger');
const morgan = require('morgan');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"))
app.use(cors(["*"]))

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
