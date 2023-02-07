const createLineItem = (price, quantity = 1) => ({
  price,
  quantity,
  adjustable_quantity: { enabled: true, minimum: 1, maximum: 10 },
});

const createSession = ({ lineItems = [], coupon }) => {
  const session = {
    line_items: lineItems,
    shipping_address_collection: {
      allowed_countries: ["BE"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "eur" },
          display_name: "Ophalen in Kalmthout (op afspraak)",
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 400, currency: "eur" },
          display_name: "Levering aan huis (binnen straal van 8km)",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 3 },
            maximum: { unit: "business_day", value: 5 },
          },
        },
      },
    ],
    mode: "payment",
    success_url: `${process.env.REDIRECT_BASEURL}?success=true`,
    cancel_url: `${process.env.REDIRECT_BASEURL}?canceled=true`,
  };

  if (coupon) {
    session.discounts = [{ coupon }];
  }

  return session;
};

module.exports = {
  createLineItem,
  createSession,
};
