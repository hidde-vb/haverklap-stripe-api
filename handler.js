require("dotenv").config();

const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const { createLineItem, createSession } = require("./src/checkout");
const { sendMail } = require("./src/email");

const app = express();

app.use(express.json());

const allowlist = ["http://haverklapbloemen.be"];

const corsOptions = function (req, callback) {
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    callback(null, { origin: true });
  } else {
    callback(null, { origin: false });
  }
};

app.use(cors(corsOptions));

/* Endpoints */

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Alive",
  });
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Error: missing id",
    });
  }

  const product = await stripe.products.retrieve(id, {
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
  const { cart, message } = req.body;

  if (!cart) {
    return res.status(400).json({
      message: "Error: missing cart",
    });
  }

  if (message) await sendMail(message, cart);

  const lineItems = cart.map((item) => {
    if (!item.id || !item.quantity) return;
    return createLineItem(item.id, item.quantity);
  });

  const session = await stripe.checkout.sessions.create(
    createSession(lineItems)
  );

  res.json({ url: session.url });
});

app.post("/checkout/:id", async (req, res) => {
  const lineItems = [createLineItem(req.params.id)];

  const session = await stripe.checkout.sessions.create(
    createSession(lineItems)
  );

  res.json({ url: session.url });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
