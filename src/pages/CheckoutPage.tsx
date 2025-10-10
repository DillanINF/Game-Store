import { useState, useEffect } from 'react';
import { enablePageScroll } from 'scroll-lock';
import { Game } from '../types/Game.types';

const paymentMethods = [
  {
    name: 'PayPal',
    logo: 'paypal.png',
    desc: 'Pay easily and securely with your PayPal account. This is a sample description to ensure all cards have the same height for a consistent look.',
  },
  {
    name: 'GoPay',
    logo: 'gopay.png',
    desc: 'Pay with GoPay e-wallet. This is a sample description to ensure all cards have the same height for a consistent look.',
  },
  {
    name: 'QRIS',
    logo: 'qris.png',
    desc: 'Pay with any QRIS-supported app. This is a sample description to ensure all cards have the same height for a consistent look.',
  },
  {
    name: 'OVO',
    logo: 'ovo.png',
    desc: 'Payment powered by Xsolla. This is a sample description to ensure all cards have the same height for a consistent look.',
  },
];

interface Props {
  cartItems: Game[];
}

export default function CheckoutPage({ cartItems }: Props) {
  const [form, setForm] = useState({ name: '', email: '', address: '', payment: paymentMethods[0].name });
  const [success, setSuccess] = useState(false);
  const [creatorTag, setCreatorTag] = useState('');
  const [shareEmail, setShareEmail] = useState(false);

  // Ensure scroll is enabled when component mounts
  useEffect(() => {
    enablePageScroll();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) setSuccess(true);
    else alert('Gagal mengirim email!');
  };

  // Calculate order summary from cart items
  const firstGame = cartItems.length > 0 ? cartItems[0] : null;
  const totalPrice = cartItems.reduce((sum, game) => sum + game.price, 0);
  const totalOriginal = totalPrice; // Assuming no discount for simplicity
  const discount = 0; // You can calculate this if you have discount logic
  
  const order = {
    image: firstGame?.background_image || '',
    title: firstGame?.name || 'No game selected',
    price: totalPrice,
    original: totalOriginal,
    discount: discount,
    publisher: firstGame?.publishers?.[0]?.name || 'Unknown',
  };

  return (
    <div className='CheckoutContainer'>
      <div className='CheckoutLeft'>
        <h2>Payment Method</h2>
        <form onSubmit={handlePay}>
          <div className='PaymentMethods'>
            {paymentMethods.map((m) => (
              <label
                key={m.name}
                className={`PaymentMethod${form.payment === m.name ? ' selected' : ''}`}
              >
                <input
                  type='radio'
                  name='payment'
                  value={m.name}
                  checked={form.payment === m.name}
                  onChange={handleChange}
                />
                <img src={process.env.PUBLIC_URL + '/assets/' + m.logo} alt={m.name} />
                <div className='info'>
                  <div className='name'>{m.name}</div>
                  <div className='desc'>
                    {form.payment === m.name ? m.desc : '\u00A0'}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </form>
        {success && <div className='SuccessMsg'>Pembayaran berhasil (simulasi)!</div>}
      </div>
      <div className='CheckoutRight'>
        <div className='OrderSummary'>
          <h3>ORDER SUMMARY</h3>
          <div className='OrderGame'>
            <img src={order.image} alt='Game' className='OrderImage' />
            <div>
              <div className='OrderGameTitle'>{order.title}</div>
              <div className='OrderGamePublisher'>By {order.publisher}</div>
            </div>
          </div>
          <div className='OrderPriceRow'>
            <span>Price</span>
            <span>
              <span className='Original'>${order.original.toFixed(2)}</span>
              {order.discount > 0 && (
                <>
                  <span className='Discount'> -${order.discount.toFixed(2)}</span>
                </>
              )}
            </span>
          </div>
          <div className='OrderPriceRow'>
            <span>Total</span>
            <span>${order.price.toFixed(2)}</span>
          </div>
          <div className='OrderPriceRow OrderYouPay'>
            <span>You Pay</span>
            <span>${order.price.toFixed(2)}</span>
          </div>
          <input
            className='CreatorTagInput'
            placeholder='ENTER A CREATOR TAG'
            value={creatorTag}
            onChange={e => setCreatorTag(e.target.value)}
          />
          <div className='ShareEmailRow'>
            <input
              type='checkbox'
              checked={shareEmail}
              onChange={e => setShareEmail(e.target.checked)}
              id='shareEmail'
            />
            <label htmlFor='shareEmail'>
              Click here to share your email with <b>{order.publisher}</b> to receive the latest news, updates, and offers for their games. You can opt-out at any time.
            </label>
          </div>
          <button className='PlaceOrderBtnGreen' type='submit'>PLACE ORDER</button>
        </div>
      </div>
    </div>
  );
}