import { useCallback, useState } from 'react';
import { useKeycloak } from './hooks/keycloak.hook';
import RenderUnAuth from './components/RenderUnAuth';
import RenderAuth from './components/RenderAuth';
import Loaded from './components/Loaded';
import reactLogo from './assets/react.svg';
import keycloakLogo from '/keycloak.svg';
import './App.css';

function App() {
  const { authUser, login, logout, isAuth, isLoaded, errorMessage, refresh, token } = useKeycloak();
  const [sid, setSid] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    fetch('http://localhost:30100/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Reject');
        }

        return res.json();
      })
      .then((res) => {
        setSid(res.sid);
      })
      .catch(() => {
        setSid('Error From Api');
      });
  }, [setSid, token]);

  return (
    <>
      <div>
        <a href='https://www.keycloak.org/' target='_blank'>
          <img src={keycloakLogo} className='logo' alt='Keycloak logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Keycloak + React</h1>
      <div className='card'>
        <Loaded isLoaded={isLoaded} errorMessage={errorMessage}>
          <RenderUnAuth isAuth={isAuth}>
            <button onClick={() => login()}>Login</button>
          </RenderUnAuth>
          <RenderAuth isAuth={isAuth}>
            <p style={{ margin: 0 }}>Email: {authUser?.token?.email}</p>
            <p style={{ margin: 0 }}>Sid: {sid ?? 'Click to Get Sid'}</p>
            <button onClick={() => fetchData()}>Get Sid From Api</button>
            <button onClick={() => logout()}>Logout</button>
            <button onClick={() => refresh()}>Refresh</button>
          </RenderAuth>
        </Loaded>
      </div>

      <p className='read-the-docs'>Keycloak Workshop</p>
    </>
  );
}

export default App;
