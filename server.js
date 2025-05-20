const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/userRoutes')
const bookingRoutes =  require('./routes/BookingRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const parkingRoutes = require('./routes/parkingRoutes')
const swaggerSpec = require('./swagger');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express')

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"))
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
  }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/payment', paymentRoutes)
app.use('/api/parking', parkingRoutes)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
