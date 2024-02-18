import type React from 'react';

const RenderAuth: React.FC<{ children: React.ReactNode; isAuth: boolean | null }> = ({ children, isAuth }) => {
  return isAuth ? children : null;
};

export default RenderAuth;
