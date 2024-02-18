import { useKeycloak } from './hooks/keycloak.hook';
import RenderUnAuth from './components/RenderUnAuth';
import RenderAuth from './components/RenderAuth';
import Loaded from './components/Loaded';
import reactLogo from './assets/react.svg';
import keycloakLogo from '/keycloak.svg';
import './App.css';

function App() {
  const { authUser, login, logout, isAuth, isLoaded, errorMessage } = useKeycloak();

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
            <p>{authUser?.token?.email}</p>
            <button onClick={() => logout()}>Logout</button>
          </RenderAuth>
        </Loaded>
      </div>

      <p className='read-the-docs'>Keycloak Workshop</p>
    </>
  );
}

export default App;
