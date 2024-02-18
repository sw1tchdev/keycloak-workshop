import type React from 'react';

const RenderUnAuth: React.FC<{ children: React.ReactNode; isAuth: boolean | null }> = ({ children, isAuth }) => {
  return !isAuth ? children : null;
};

export default RenderUnAuth;
