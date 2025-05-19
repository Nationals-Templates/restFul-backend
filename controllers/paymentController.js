const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const getPayment = async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    return res.status(400).json({ error: 'Booking ID is required' });
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: {
        bookingId: parseInt(bookingId),
      },
      include: {
        booking: true,
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found for this booking' });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

module.exports = {
  getPayment,
};
