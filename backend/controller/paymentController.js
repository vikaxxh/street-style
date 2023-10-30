const asyncWrapper = require("../middleware/async");

const stripe = require("stripe")(
  "sk_test_51KzyYrSHJpXuNXzuJOgrHs0K17StZWR56CUiLSL7hOBEGMXcvu2axrtNRfmCoDURJRs6pGP5BSsXTbO1uuNlhLVD00uCMOEz1v"
);

exports.processPayment = asyncWrapper(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = asyncWrapper(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
