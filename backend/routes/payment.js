import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/order - Create Razorpay order
router.post('/order', auth, async (req, res) => {
  try {
    const options = {
      amount: 49900, // ₹499 in paisa
      currency: 'INR',
      receipt: `receipt_order_${req.userId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
});

// POST /api/payment/verify - Verify signature and upgrade user
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update the user to premium in the database
      const user = await User.findByIdAndUpdate(
        req.userId,
        { isPremium: true },
        { new: true }
      ).select('-password');

      return res.json({
        success: true,
        message: 'Payment verified successfully and account upgraded to Premium!',
        user,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid payment signature!' });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error during signature verification' });
  }
});

export default router;
