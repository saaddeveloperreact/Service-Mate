const Razorpay = require("razorpay");
const crypto = require("crypto");
const Subscription = require("../models/Subscription");
const Provider = require("../models/Provider");

const PLANS = {
  monthly: { amount: 40000, months: 1, label: "1 Month" }, // paise
  quarterly: { amount: 70000, months: 3, label: "3 Months" },
  biannual: { amount: 120000, months: 6, label: "6 Months" },
};

const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

// ==============================
// Create Razorpay Order
// ==============================
exports.createOrder = async (req, res, next) => {
  try {
    console.log("========== CREATE ORDER ==========");
    console.log("USER:", req.user);
    console.log("BODY:", req.body);
    console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);
    console.log(
      "RAZORPAY SECRET:",
      process.env.RAZORPAY_KEY_SECRET ? "SECRET EXISTS" : "SECRET MISSING",
    );

    const { plan } = req.body;

    // Validate plan
    if (!PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan",
      });
    }

    const { amount, label } = PLANS[plan];

    // Initialize Razorpay
    const razorpay = getRazorpay();

    // Create order
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",

      // Keep receipt short (max 40 chars)
      receipt: `sub_${Date.now()}`,

      notes: {
        provider: req.user._id.toString(),
        plan,
      },
    });

    console.log("ORDER CREATED:", order);

    // Success response
    res.status(200).json({
      success: true,
      order,
      plan,
      amount: amount / 100,
      label,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }
};

// ==============================
// Verify Payment
// ==============================
exports.verifyPayment = async (req, res, next) => {
  try {
    console.log("========== VERIFY PAYMENT ==========");
    console.log("BODY:", req.body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      console.log("SIGNATURE MISMATCH");

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const { months } = PLANS[plan];

    const startDate = new Date();

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);

    // Save subscription
    const sub = await Subscription.create({
      provider: req.user._id,
      plan,
      amount: PLANS[plan].amount / 100,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "active",
      startDate,
      endDate,
      durationMonths: months,
    });

    // Update provider subscription
    await Provider.findByIdAndUpdate(req.user._id, {
      subscription: {
        status: "active",
        plan,
        endDate,
      },
    });

    console.log("SUBSCRIPTION ACTIVATED");

    res.status(200).json({
      success: true,
      message: "Subscription activated!",
      subscription: sub,
    });
  } catch (err) {
    console.error("VERIFY PAYMENT ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }
};

// ==============================
// Get Subscription Status
// ==============================
exports.getSubscription = async (req, res, next) => {
  try {
    console.log("========== GET SUBSCRIPTION ==========");
    console.log("USER:", req.user);
    const provider = await Provider.findById(req.user._id);

    const latest = await Subscription.findOne({ provider: req.user._id }).sort({
      createdAt: -1,
    });

    // Auto expire subscription
    if (
      provider.subscription?.endDate &&
      new Date() > provider.subscription.endDate
    ) {
      await Provider.findByIdAndUpdate(req.user._id, {
        "subscription.status": "expired",
      });

      provider.subscription.status = "expired";
    }

    res.status(200).json({
      success: true,
      subscription: provider.subscription,
      latest,
    });
  } catch (err) {
    console.error("GET SUBSCRIPTION ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }
};
