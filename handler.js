require("dotenv").config();

const serverless = require("serverless-http");
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Alive",
  });
});

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "price_1LzPqIJQikXYBFLjJquHa9my",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.REDIRECT_BASEURL}?success=true`,
    cancel_url: `${process.env.REDIRECT_BASEURL}?canceled=true`,
  });

  res.redirect(303, session.url);
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
