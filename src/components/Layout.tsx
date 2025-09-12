import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { Navbar, Footer } from '.';
import { fetchUserDetails } from '../apis/fetchApis';
import useCart from '../hooks/useCart';
import { setAuth } from '../redux/reducer/authSlice';

const Layout = () => {
  const { fetchCart } = useCart();

  const dispatch = useDispatch();
  function getSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('sessionId', sessionId);
    }
  }
  const authToken = Cookies.get('JWT');
  useEffect(() => {
    getSessionId();
  }, []);

  useEffect(() => {
    if (authToken) {
      const fetchData = async () => {
        try {
          const userDetails = await fetchUserDetails(authToken);
          dispatch(setAuth(userDetails));
          await fetchCart();
        } catch (error) {
          console.error('Error fetching user data or cart:', error);
        }
      };

      void fetchData();
    }
  }, [authToken, dispatch]);

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh' }}>
      <Navbar />
      <main className="flex-grow-1 bg-custom-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
