import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto'
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
      //receipt of the user 
      receipt: `receipt_order_${req.userId}_${Date.now()}`,
    };

    //for API call from  server to Razorpay's servers (for creating bill to payment).
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

router.post('/verify', auth, async(req,res) => {
   try {
     const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex')

  //now checking if payment is real and successful

  if(expectedSign === razorpay_signature){

    const user = await User.findByIdAndUpdate(
      req.userId,
      {isPremium: true },
      {new : true}
    ).select("-password")
     return res.json({
        success: true,
        message: 'Payment verified! Welcome to Premium!',
        user,
      });
    } else {
      // ❌ Signature mismatch — someone is faking it
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
export default router;