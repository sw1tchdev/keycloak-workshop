import type React from 'react';
import Spinner from './Spinner';

const Loaded: React.FC<{ children: React.ReactNode; errorMessage: string | null; isLoaded: boolean }> = ({
  children,
  errorMessage,
  isLoaded,
}) => {
  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  if (!isLoaded) {
    return <Spinner />;
  }

  return children;
};

export default Loaded;
