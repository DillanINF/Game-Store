import { memo, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Headroom from 'react-headroom';
import {
  addScrollableSelector,
  disablePageScroll,
} from 'scroll-lock';
import {
  RiReactjsLine,
  RiShoppingBag2Line,
} from 'react-icons/ri';
import SearchBar from './SearchBar';
import Transition from './Transition';
import Button from './Button';
import { Game } from '../types/Game.types';

interface Props {
  cartItems: Game[],
  setIsCartOpen: (isCartOpen: boolean) => void,
}

function Header(props: Props) {
  const { cartItems, setIsCartOpen } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileBoxRef = useRef<HTMLDivElement>(null);
  const isCheckoutPage = location.pathname === '/checkout';
  const navigateToHome = () => navigate('/');
  const openCart = () => {
    setIsCartOpen(true);
    addScrollableSelector('.Items');
    disablePageScroll();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileBoxRef.current && !profileBoxRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Ambil data user dari localStorage
  let user: any = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Ambil inisial user (huruf pertama nama/email)
  const getInitial = (user: any) => {
    if (!user) return '?';
    if (user.name) return user.name[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return '?';
  };

  return (
    <Headroom upTolerance={1}>
      <Transition
        className="Header"
        direction="down"
        distance={20}
      >
        <Button
          className="Logo"
          handleClick={navigateToHome}
        >
          <RiReactjsLine /> GameStore
        </Button>
        {!isCheckoutPage && <SearchBar />}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifySelf: 'flex-end' }}>
          <Button
            className="Cart"
            handleClick={openCart}
          >
            <RiShoppingBag2Line />
            Cart
            <div>{cartItems.length}</div>
          </Button>
          {user && (
            <div className="ProfileBox" ref={profileBoxRef}>
              <div className="ProfileAvatar" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                {getInitial(user)}
              </div>
              <div className="ProfileInfo">
                {user.name || user.email}
              </div>
              <Button className="Logout LogoutDesktop" handleClick={handleLogout} title="Logout">
                Logout
              </Button>
              {isProfileMenuOpen && (
                <div className="ProfileDropdown">
                  <div className="ProfileDropdownName">{user.name || user.email}</div>
                  <Button className="Logout LogoutMobile" handleClick={handleLogout} title="Logout">
                    Logout
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Transition>
    </Headroom>
  );
}

export default memo(Header);
