const stripe = Stripe('pk_live_51SHrz3C5NPvScGhcEHuErZAgF7B4L0x36stXFMfAyP7NWEuaP8ppvZuJ7XX6aSyGABaQ2tJElHwMIEg9r7q7u0HL00IzuNJCAc');

async function initExpressCheckout(amount) {
  const response = await fetch('https://tapvia-checkout.vercel.app/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });

  const { clientSecret } = await response.json();

  const elements = stripe.elements({ clientSecret });

  const expressElement = elements.create('expressCheckout', {
    buttonType: { applePay: 'buy', googlePay: 'buy' }
  });

  expressElement.mount('#tapvia-express-checkout');

  expressElement.on('confirm', async (event) => {
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
        shipping: event.shippingAddress,
        payment_method_data: {
          billing_details: {
            name: event.billingDetails.name,
            email: event.billingDetails.email,
            address: event.billingDetails.address
          }
        }
      }
    });

    if (error) {
      console.error(error);
    }
  });
}
