import { createContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { writeBatch, doc } from "firebase/firestore";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState("Pendiente");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ordersToDelete, setOrdersToDelete] = useState([]);
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

  const openDeleteModal = (orderIds) => {
    if (!orderIds) return;
    const ids = Array.isArray(orderIds) ? orderIds : [orderIds];
    if (ids.length === 0) return;
    setOrdersToDelete(ids);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setOrdersToDelete([]);
  };

  const confirmDelete = async () => {
    if (ordersToDelete.length === 0 || isDeleting) return;

    setIsDeleting(true);
    try {
      const batch = writeBatch(db);
      ordersToDelete.forEach((orderId) => {
        batch.delete(doc(db, "orders", orderId));
      });
      await batch.commit();

      setOrders((prevOrders) =>
        prevOrders.filter((order) => !ordersToDelete.includes(order.id)),
      );
      setOrdersToDelete([]);
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
        ordersToDelete,
        openDeleteModal,
        closeDeleteModal,
        isDeleting,
        confirmDelete,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
