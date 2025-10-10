import { useCallback, useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header, Cart } from './components';
import { gameList } from './rawg-api';
import { Home, GameList, GameDetails, NotFound, CheckoutPage, LoginPage } from './pages';
import getPrice from './utils/getPrice';
import { Game } from './types/Game.types';
import './scss/App.scss';
import ProtectedRoute from './components/ProtectedRoute';

const loadGames = async (search = '') => {
  const response = await gameList({ page_size: 50, search });
  let { results } = response;
  results = results.filter((game) => game.ratings_count > (search ? 50 : 10));
  results.forEach((game) => game.price = getPrice(game));
  return results;
};

function App() {
  const [cartItems, setCartItems] = useState<Game[]>(() => {
    // Load cart items from localStorage on initial render
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((game: Game) => {
    setCartItems([...cartItems, game]);
  }, [cartItems]);
  const removeFromCart = useCallback((ids: number[]) => {
    setCartItems(cartItems.filter((item) => !ids.includes(item.id)));
  }, [cartItems]);

  // Jangan render Header jika di halaman login
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="App">
      {!isLoginPage && (
        <Header cartItems={cartItems} setIsCartOpen={setIsCartOpen} />
      )}
      <AnimatePresence exitBeforeEnter>
        {isCartOpen && !isLoginPage && (
          <Cart
            cartItems={cartItems}
            setIsCartOpen={setIsCartOpen}
            removeFromCart={removeFromCart}
          />
        )}
      </AnimatePresence>
      <AnimatePresence exitBeforeEnter>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home loadGames={loadGames} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <GameList
                  loadGames={loadGames}
                  cartItems={cartItems}
                  addToCart={addToCart}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/games/:gameId"
            element={
              <ProtectedRoute>
                <GameDetails
                  cartItems={cartItems}
                  addToCart={addToCart}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage cartItems={cartItems} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
