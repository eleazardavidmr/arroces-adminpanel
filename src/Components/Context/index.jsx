import { createContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { deleteDoc, doc } from "firebase/firestore";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState("Pendiente");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openChangeStatusModal = () => {
    setIsChangeStatusModalOpen(true);
  };
  const closeChangeStatusModal = () => {
    setIsChangeStatusModalOpen(false);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("es-CO").format(number);
  };

  const confirmDelete = async () => {
    if (!orderToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "orders", orderToDelete));
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderToDelete),
      );
      setOrderToDelete(null);
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Hubo un error al eliminar el pedido.");
    } finally {
      setIsDeleting(false);
    }
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
        formatNumber,
        orders,
        setOrders,
        isLoading,
        setIsLoading,
        orderToDelete,
        setOrderToDelete,
        isDeleting,
        confirmDelete,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
