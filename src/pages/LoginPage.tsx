import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FaFacebook } from 'react-icons/fa';

export default function LoginPage() {
  const [user, setUser] = useState<any>(null);
  const [fbReady, setFbReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.email) navigate('/');
      } catch {
        localStorage.removeItem('user');
      }
    }

    // Check if Facebook SDK is ready
    const checkFacebookSDK = () => {
      if (typeof window.FB !== 'undefined') {
        console.log('Facebook SDK is ready');
        setFbReady(true);
      } else {
        console.log('Facebook SDK not ready yet, retrying...');
        setTimeout(checkFacebookSDK, 1000);
      }
    };

    checkFacebookSDK();
  }, [navigate]);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: 'linear-gradient(120deg, #18181b 0%, #23232b 40%, #2d1e3c 100%)',
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(35, 35, 43, 0.75)',
    borderRadius: '20px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
    padding: '60px 50px',
    width: '100%',
    maxWidth: '450px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '40px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const titleStyle: React.CSSProperties = {
    color: 'white',
    fontWeight: 700,
    fontSize: '32px',
    textAlign: 'center',
    fontFamily: 'GT Walsheim Pro, -apple-system, BlinkMacSystemFont, sans-serif',
    letterSpacing: '-0.5px',
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    color: 'hsl(0, 0%, 80%)',
    fontSize: '16px',
    textAlign: 'center',
    margin: 0,
    lineHeight: '1.5',
  };

  const loginBtn: React.CSSProperties = {
    width: '100%',
    height: '56px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: 600,
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    cursor: 'pointer',
    margin: 0,
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  };

  const googleBtn = {
    ...loginBtn,
    background: '#ffffff',
    color: '#374151',
    border: '1px solid #e5e7eb',
  };

  const facebookBtn = {
    ...loginBtn,
    background: '#1877f2',
    color: '#ffffff',
  };



  const dividerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    margin: '20px 0',
  };

  const dividerLineStyle: React.CSSProperties = {
    flex: 1,
    height: '1px',
    background: 'rgba(255, 255, 255, 0.2)',
  };

  const dividerTextStyle: React.CSSProperties = {
    padding: '0 16px',
    color: 'hsl(0, 0%, 60%)',
    fontSize: '14px',
    fontWeight: 500,
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login button clicked');
    console.log('FB SDK available:', typeof window.FB !== 'undefined');
    
    // Check if Facebook SDK is loaded
    if (typeof window.FB !== 'undefined') {
      console.log('Initializing Facebook login...');
      
      try {
        window.FB.login((response: any) => {
          console.log('Facebook login response:', response);
          
          if (response.authResponse) {
            // User successfully logged in
            const { accessToken } = response.authResponse;
            console.log('Access token received:', accessToken);
            
            // Get user info
            window.FB.api('/me', { fields: 'id,name,email,picture' }, (userInfo: any) => {
              console.log('User info received:', userInfo);
              
              if (userInfo && !userInfo.error) {
                const userData = {
                  id: userInfo.id,
                  name: userInfo.name,
                  email: userInfo.email,
                  picture: userInfo.picture?.data?.url,
                  provider: 'facebook',
                };
                
                console.log('Setting user data:', userData);
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                navigate('/');
              } else {
                console.error('Failed to get user info:', userInfo);
                alert('Gagal mendapatkan informasi user Facebook');
              }
            });
          } else {
            // User cancelled login
            console.log('User cancelled Facebook login');
          }
        }, { scope: 'public_profile,email' });
      } catch (error) {
        console.error('Facebook login error:', error);
        alert('Error saat login Facebook: ' + error);
      }
    } else {
      console.error('Facebook SDK not loaded');
      alert('Facebook SDK belum dimuat. Silakan refresh halaman.');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={titleStyle}>Welcome Back</div>
          <div style={subtitleStyle}>Sign in to your GameStore account</div>
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Google Login */}
          <div className="login-google-btn" style={{ width: '100%' }}>
            <GoogleLogin
              onSuccess={(res) => {
                const decoded: any = jwtDecode(res.credential!);
                setUser(decoded);
                localStorage.setItem('user', JSON.stringify(decoded));
                navigate('/');
              }}
              onError={() => alert('Login Google gagal!')}
              useOneTap={true}
            />
          </div>

          <div style={dividerStyle}>
            <div style={dividerLineStyle}></div>
            <div style={dividerTextStyle}>atau</div>
            <div style={dividerLineStyle}></div>
          </div>

          {/* Facebook Login */}
          <button style={facebookBtn} onClick={handleFacebookLogin} type="button">
            <FaFacebook size={20} />
            <span>Continue with Facebook</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div style={{ color: 'hsl(0, 0%, 60%)', fontSize: '14px' }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>

      <style>
        {`
        .login-google-btn * {
          border-radius: 12px !important;
        }
        .login-google-btn div[role="button"] {
          min-height: 56px !important;
          height: 56px !important;
          display: flex !important;
          align-items: center !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          padding: 0 24px !important;
          margin-bottom: 0 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
          justify-content: center !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          background: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }

        button:hover, .login-google-btn div[role="button"]:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
        }
        
        button:active, .login-google-btn div[role="button"]:active {
          transform: translateY(0);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 40px 30px;
            margin: 20px;
          }
        }
        `}
      </style>
    </div>
  );
}