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

app.get("/products/:id", async (req, res) => {
  const product = await stripe.products.retrieve(req.params.id, {
    expand: ["default_price"],
  });

  res.json({
    name: product.name,
    price: {
      id: product.default_price.id,
      value: product.default_price.unit_amount,
    },
  });
});

app.post("/checkout/:id", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: req.params.id,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.REDIRECT_BASEURL}?success=true`,
    cancel_url: `${process.env.REDIRECT_BASEURL}?canceled=true`,
  });

  res.json({ url: session.url });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
