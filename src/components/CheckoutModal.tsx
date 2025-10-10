import React, { useState } from 'react';
import ovoLogo from '../assets/ovo.png';
import gopayLogo from '../assets/gopay.png';
import qrisLogo from '../assets/qris.png';
import paypalLogo from '../assets/paypal.png';

const paymentMethods = [
  { name: 'PayPal', logo: 'paypal.png', desc: 'Pay easily and securely with your PayPal account.' },
  { name: 'GoPay', logo: 'gopay.png', desc: 'Pay with GoPay e-wallet.' },
  { name: 'QRIS', logo: 'qris.png', desc: 'Pay with any QRIS-supported app.' },
  { name: 'OVO', logo: 'ovo.png', desc: 'Payment powered by Xsolla.' },
];

interface CheckoutModalProps {
  onClose: () => void;
}

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const [selected, setSelected] = useState(paymentMethods[0].name);
  const [success, setSuccess] = useState(false);

  const handlePay = () => setSuccess(true);

  return (
    <div className='ModalOverlay'>
      <div className='ModalContent'>
        <h2>Pilih Metode Pembayaran</h2>
        <div className='PaymentOptions'>
          {paymentMethods.map((m) => (
            <label key={m.name} className='PaymentOption'>
              <input
                type='radio'
                name='payment'
                value={m.name}
                checked={selected === m.name}
                onChange={() => setSelected(m.name)}
              />
              <img src={m.logo} alt={m.name} width={60} />
              <div className='info'>
                <div className='name'>{m.name}</div>
                <div className='desc'>
                  {selected === m.name ? m.desc : '\u00A0'}
                </div>
              </div>
            </label>
          ))}
        </div>
        <button onClick={handlePay}>Bayar</button>
        <button onClick={onClose}>Batal</button>
        {success && <div className='SuccessMsg'>Pembayaran berhasil (simulasi)!</div>}
      </div>
    </div>
  );
}
