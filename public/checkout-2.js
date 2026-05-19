(function() {
  function loadStripe(cb) {
    if (window.Stripe) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://js.stripe.com/v3/';
    s.onload = cb;
    document.head.appendChild(s);
  }
  function init() {
    loadStripe(function() {
      fetch('https://tapvia-checkout.vercel.app/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 6999 })
      })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var div = document.createElement('div');
        div.id = 'tapvia-express';
        div.style.cssText = 'width:100%;margin:20px 0;';
        var target = document.querySelector('.checkout-info-inner') || document.querySelector('.cart-wrapper') || document.body;
        target.insertBefore(div, target.firstChild);
        var stripe = Stripe('pk_live_51SHrz3C5NPvScGhcEHuErZAgF7B4L0x36stXFMfAyP7NWEuaP8ppvZuJ7XX6aSyGABaQ2tJElHwMIEg9r7q7u0HL00IzuNJCAc');
        var elements = stripe.elements({ clientSecret: data.clientSecret });
        var el = elements.create('expressCheckout');
        el.mount('#tapvia-express');
        el.on('confirm', function() {
          stripe.confirmPayment({
            elements: elements,
            confirmParams: { return_url: 'https://checkout.shopfunnels.net/discount }
          });
        });
      })
      .catch(function(e) { console.error('Tapvia express error:', e); });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
