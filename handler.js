require("dotenv").config();

const serverless = require("serverless-http");
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const { createLineItem, createSession } = require('./src/checkout')

const app = express();
app.use(express.json());

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

app.post("/checkout", async (req, res) => {
  const { cart } = req.body
  const lineItems = cart.map(item => {
    if(!item.id || !item.quantity) return;
    console.log(item)
    return createLineItem(item.id, item.quantity);
  });

  console.log(lineItems)

  const session = await stripe.checkout.sessions.create(createSession(lineItems));

  res.json({ url: session.url });
});

app.post("/checkout/:id", async (req, res) => {
  const lineItems = [createLineItem(req.params.id)];

  const session = await stripe.checkout.sessions.create(createSession(lineItems));

  res.json({ url: session.url });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
