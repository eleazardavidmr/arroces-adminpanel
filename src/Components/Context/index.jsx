import { createContext, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <ProductContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </ProductContext.Provider>
  );
};
