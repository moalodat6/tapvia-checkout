export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  const amount = req.body && req.body.amount ? Number(req.body.amount) : 6999;
  const allowed = [100, 6999, 6998, 8997, 10496];
  if (!allowed.includes(amount)) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Invalid amount' }));
    return;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
  });

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({ clientSecret: paymentIntent.client_secret }));
}
