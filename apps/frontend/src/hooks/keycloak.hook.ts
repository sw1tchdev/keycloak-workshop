import Keycloak, { KeycloakTokenParsed } from 'keycloak-js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const createKeycloak = (): Keycloak.KeycloakInstance =>
  new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  });

export const useKeycloak = () => {
  const keycloak = useMemo(() => createKeycloak(), []);
  const [authUser, setAuthUser] = useState<null | { token?: KeycloakTokenParsed }>(null);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const didInitialize = useRef(false);

  const keycloakInit = useCallback(() => {
    keycloak
      .init({
        // TODO Write Right Options
      })
      .then((isAuth) => {
        setIsLoaded(true);
        setIsAuth(isAuth);
        if (isAuth) {
          setAuthUser({ token: keycloak.tokenParsed });
        }
      })
      .catch(({ error }) => {
        setErrorMessage(error);
      });
  }, [keycloak]);

  const login = useCallback(
    (redirectUri?: string) => {
      keycloak.login({ redirectUri });
    },
    [keycloak],
  );

  const logout = useCallback(
    (redirectUri?: string) => {
      keycloak.logout({ redirectUri });
    },
    [keycloak],
  );

  useEffect(() => {
    if (didInitialize.current) {
      return;
    }
    didInitialize.current = true;

    keycloakInit();
  }, [keycloak, keycloakInit]);

  return { authUser, isAuth, login, logout, isLoaded, errorMessage };
};
