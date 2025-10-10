import { AnimatePresence, motion } from 'framer-motion';
import { enablePageScroll } from 'scroll-lock';
import { RiArrowRightLine } from 'react-icons/ri';
import { Game } from '../types/Game.types';
import Transition from './Transition';
import CartItem from './CartItem';
import Button from './Button';
import CheckoutModal from './CheckoutModal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  cartItems: Game[],
  setIsCartOpen: (isCartOpen: boolean) => void,
  removeFromCart: (ids: number[]) => void,
}

function Cart(props: Props) {
  const {
    cartItems,
    setIsCartOpen,
    removeFromCart,
  } = props;
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();
  const clearCart = () => {
    removeFromCart(cartItems.map(item => item.id));
  };
  const closeCart = () => {
    setIsCartOpen(false);
    enablePageScroll();
  };
  let gamesCount;
  if (cartItems.length > 1) {
    gamesCount = `${cartItems.length} games`;
  } else if (cartItems.length === 1) {
    gamesCount = '1 game';
  } else {
    gamesCount = 'No games added';
  }
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price, 0)
    .toFixed(2);

  const handleOpenCheckoutModal = () => setShowCheckout(true);
  const handleCloseCheckoutModal = () => setShowCheckout(false);
  const handleCheckout = () => {
    setIsCartOpen(false);
    enablePageScroll();
    navigate('/checkout');
  };

  return (
    <>
      <Transition className="Background">
        <div onClick={closeCart} />
      </Transition>
      <motion.div
        className="CartModal"
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{
          opacity: 0, x: '100%',
          transition: { duration: 0.25 },
        }}
        transition={{
          type: 'spring',
          duration: 0.5,
        }}
      >
        <div className="CartHeader">
          <h3>{gamesCount}</h3>
          {cartItems.length > 0 && (
            <Button handleClick={clearCart}>Clear</Button>
          )}
        </div>
        <div className="Items">
          <AnimatePresence>
            {cartItems.map((game) => (
              <CartItem
                key={`cart-${game.id}`}
                game={game}
                closeCart={closeCart}
                removeFromCart={removeFromCart} />
            ))}
          </AnimatePresence>
        </div>
        <div className="Checkout">
          <div>Total: ${+totalPrice}</div>
          {cartItems.length > 0 && (
            <Button handleClick={handleCheckout} className="CheckoutButton">
              Checkout
            </Button>
          )}
        </div>
      </motion.div>
      {showCheckout && <CheckoutModal onClose={handleCloseCheckoutModal} />}
    </>
  );
}

export default Cart;
