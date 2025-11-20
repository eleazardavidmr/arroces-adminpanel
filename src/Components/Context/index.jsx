import { createContext, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState("Pendiente");
  const openChangeStatusModal = () => {
    setIsChangeStatusModalOpen(true);
  };
  const closeChangeStatusModal = () => {
    setIsChangeStatusModalOpen(false);
  };

  return (
    <ProductContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isChangeStatusModalOpen,
        setIsChangeStatusModalOpen,
        openChangeStatusModal,
        closeChangeStatusModal,
        orderStatus,
        setOrderStatus,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
