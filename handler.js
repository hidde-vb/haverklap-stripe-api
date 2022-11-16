import * as dotenv from "dotenv";
dotenv.config();

import serverless from "serverless-http";
import express from "express";
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
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "pr_1234",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const handler = serverless(app);
