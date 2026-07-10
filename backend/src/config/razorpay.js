const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (amount, currency = 'INR', receipt) => {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      payment_capture: 1, // Auto capture payment
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error(`Failed to create Razorpay order: ${error.message}`);
  }
};

const verifyRazorpayPayment = async (orderId, paymentId, signature) => {
  try {
    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  } catch (error) {
    throw new Error(`Failed to verify Razorpay payment: ${error.message}`);
  }
};

const refundPayment = async (paymentId, amount) => {
  try {
    const options = {
      amount: amount ? amount * 100 : undefined, // Amount in paise
    };

    const refund = await razorpay.payments.refund(paymentId, options);
    return refund;
  } catch (error) {
    throw new Error(`Failed to process refund: ${error.message}`);
  }
};

module.exports = {
  razorpay,
  createRazorpayOrder,
  verifyRazorpayPayment,
  refundPayment,
};
