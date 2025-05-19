const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/userRoutes')
const bookingRoutes =  require('./routes/BookingRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const swaggerSpec = require('./swagger');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express')

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/payment', paymentRoutes)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
