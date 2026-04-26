import { createContext, useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState("Pendiente");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const DBorders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 💡 LÓGICA DE ORDENAMIENTO POR FECHA (DESCENDENTE) 💡
      // Si 'date' es un Timestamp de Firebase, lo convertimos a un objeto Date para compararlo.
      DBorders.sort((a, b) => {
        // Se usa el valor numérico (milisegundos) para la comparación
        const dateA = a.date?.toDate ? a.date.toDate().getTime() : 0;
        const dateB = b.date?.toDate ? b.date.toDate().getTime() : 0;
        // Orden descendente (más reciente primero): b - a
        return dateB - dateA;
      });
      // ----------------------------------------------------

      setOrders(DBorders);
    } catch (e) {
      console.error("Error getting documents: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openChangeStatusModal = () => {
    setIsChangeStatusModalOpen(true);
  };
  const closeChangeStatusModal = () => {
    setIsChangeStatusModalOpen(false);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("es-CO").format(number);
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
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
