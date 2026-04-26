import {
  IconShoppingCart,
  IconFolder,
  IconUsersGroup,
  IconLogout2,
  IconChevronRight,
  IconChevronLeft,
  IconTrash,
  IconAlertTriangle,
  IconRotate,
  IconX,
  IconSoup,
  IconCash,
} from "@tabler/icons-react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useState, useContext, useEffect } from "react";
import { ProductContext } from "../../Context";
import StatusBadge from "../StatusBadge";
import { db } from "../../../firebase";
export default function Table() {
  const context = useContext(ProductContext);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderIds, setSelectedOrderIds] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState("Pendiente");
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const { orders, setOrders, isDeleting, openDeleteModal } = context;

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const changeOrderStatus = async (orderId, newStatus) => {
    const previousOrders = [...orders];
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          orderInfo: { ...order.orderInfo, status: newStatus },
        };
      }
      return order;
    });

    setOrders(updatedOrders);

    try {
      const orderDocRef = doc(db, "orders", orderId);
      await updateDoc(orderDocRef, { "orderInfo.status": newStatus });
    } catch (error) {
      console.error("Error update:", error);
      setOrders(previousOrders);
      alert("Error al actualizar estado");
    }
  };

  const handleSelectAllOrders = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedOrderIds(new Set(orders.map((order) => order.id)));
      return;
    }
    setSelectedOrderIds(new Set());
  };

  const handleSelectOrder = (orderId, isChecked) => {
    setSelectedOrderIds((prevSelected) => {
      const nextSelected = new Set(prevSelected);
      if (isChecked) {
        nextSelected.add(orderId);
      } else {
        nextSelected.delete(orderId);
      }
      return nextSelected;
    });
  };

  const applyBulkStatusChange = async () => {
    if (selectedOrderIds.size === 0 || isBulkUpdating || isDeleting) return;

    const selectedIds = Array.from(selectedOrderIds);
    const previousOrders = [...orders];
    const updatedOrders = orders.map((order) =>
      selectedOrderIds.has(order.id)
        ? {
            ...order,
            orderInfo: { ...order.orderInfo, status: bulkStatus },
          }
        : order,
    );

    setIsBulkUpdating(true);
    setOrders(updatedOrders);
    try {
      await Promise.all(
        selectedIds.map((orderId) =>
          updateDoc(doc(db, "orders", orderId), { "orderInfo.status": bulkStatus }),
        ),
      );
    } catch (error) {
      console.error("Error bulk update:", error);
      setOrders(previousOrders);
      alert("No se pudo actualizar el estado de los pedidos seleccionados.");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const openBulkDeleteModal = () => {
    if (selectedOrderIds.size === 0 || isDeleting || isBulkUpdating) return;
    openDeleteModal(Array.from(selectedOrderIds));
  };

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

  useEffect(() => {
    setSelectedOrderIds((prevSelected) => {
      const orderIdSet = new Set(orders.map((order) => order.id));
      const nextSelected = new Set();
      prevSelected.forEach((id) => {
        if (orderIdSet.has(id)) nextSelected.add(id);
      });
      return nextSelected;
    });
  }, [orders]);

  const areAllOrdersSelected =
    orders.length > 0 && selectedOrderIds.size === orders.length;

  return (
    <div className="flex-1 overflow-hidden rounded-xl border border-border-light bg-surface-light shadow-xl flex flex-col relative dark:border-white/5 dark:bg-white/2">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>

      <div className="overflow-x-auto flex-1">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-light/50 px-6 py-3 dark:border-white/5">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {selectedOrderIds.size > 0
              ? `${selectedOrderIds.size} pedido(s) seleccionado(s)`
              : "Selecciona pedidos para acciones masivas"}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="appearance-none rounded bg-background-light border border-border-light/50 px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-primary focus:text-primary cursor-pointer transition-colors dark:bg-background-dark dark:border-white/10 dark:text-gray-300"
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              disabled={selectedOrderIds.size === 0 || isBulkUpdating || isDeleting}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En preparación">En preparación</option>
              <option value="Lista">Lista</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
            <button
              onClick={applyBulkStatusChange}
              disabled={selectedOrderIds.size === 0 || isBulkUpdating || isDeleting}
              className="rounded border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBulkUpdating ? "Actualizando..." : "Cambiar estado"}
            </button>
            <button
              onClick={openBulkDeleteModal}
              disabled={selectedOrderIds.size === 0 || isDeleting || isBulkUpdating}
              className="rounded border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Eliminar seleccionados
            </button>
          </div>
        </div>
        <table className="w-full min-w-[1000px] text-left">
          <thead className="bg-background-light/50 text-xs uppercase text-gray-600 font-semibold tracking-wider sticky top-0 backdrop-blur-md dark:bg-white/5 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4">
                <input
                  type="checkbox"
                  name="all-orders"
                  checked={areAllOrdersSelected}
                  onChange={(e) => handleSelectAllOrders(e)}
                  className="h-4 w-4 cursor-pointer rounded border border-border-light/70 bg-background-light text-primary focus:ring-2 focus:ring-primary/50 focus:ring-offset-0 dark:border-white/20 dark:bg-background-dark"
                />
              </th>
              <th className="px-6 py-4">Pedido</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Ubicación</th>
              <th className="px-6 py-4 text-center">Cant.</th>
              <th className="px-6 py-4">Total / Pago</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light/50 dark:divide-white/5">
            {isLoading ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-gray-500 animate-pulse"
                >
                  Cargando pedidos...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No hay pedidos registrados.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  className="hover:bg-primary/5 transition-colors group dark:hover:bg-white/3"
                  key={order.id}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.has(order.id)}
                      onChange={(e) =>
                        handleSelectOrder(order.id, e.target.checked)
                      }
                      className="h-4 w-4 cursor-pointer rounded border border-border-light/70 bg-background-light text-primary focus:ring-2 focus:ring-primary/50 focus:ring-offset-0 dark:border-white/20 dark:bg-background-dark"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-primary">
                        #{order.id.slice(0, 6)}...
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(order.date)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-text-light dark:text-background-light">
                        {order.userInfo.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.userInfo.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col max-w-[200px]">
                      <span className="text-sm text-gray-700 truncate dark:text-gray-300">
                        {order.userInfo.address}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.userInfo.delivery
                          ? "🛵 Domicilio"
                          : "🏪 Recogida"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="rounded-md bg-white/5 px-2 py-1 text-sm font-bold text-gray-700 border border-border-light/50 dark:text-gray-300 dark:border-white/5">
                      {order.orderInfo.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary text-base">
                        ${context.formatNumber(order.orderInfo.total)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.userInfo.payment.includes("Transferencia")
                          ? "Transferencia"
                          : "Efectivo"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={order.orderInfo.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <div className="relative">
                        <select
                          className="appearance-none rounded bg-background-light border border-border-light/50 px-3 py-1 pr-8 text-xs text-gray-700 focus:outline-none focus:border-primary focus:text-primary cursor-pointer transition-colors dark:bg-background-dark dark:border-white/10 dark:text-gray-300"
                          value={order.orderInfo.status}
                          onChange={(e) =>
                            changeOrderStatus(order.id, e.target.value)
                          }
                        >
                          <option
                            className="bg-background-light dark:bg-background-dark"
                            value="Pendiente"
                          >
                            Pendiente
                          </option>
                          <option
                            className="bg-background-light dark:bg-background-dark"
                            value="En preparación"
                          >
                            En preparación
                          </option>
                          <option
                            className="bg-background-light dark:bg-background-dark"
                            value="Lista"
                          >
                            Lista
                          </option>
                          <option
                            className="bg-background-light dark:bg-background-dark"
                            value="Completada"
                          >
                            Completada
                          </option>
                          <option
                            className="bg-background-light dark:bg-background-dark"
                            value="Cancelada"
                          >
                            Cancelada
                          </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                          <svg
                            className="h-3 w-3 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                      </div>

                      <button
                        onClick={() => openDeleteModal(order.id)}
                        disabled={isDeleting}
                        className="rounded p-1.5 text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/20"
                        title="Eliminar pedido"
                      >
                        <IconTrash size={18} stroke={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border-light/50 bg-background-light/50 px-6 py-4 flex justify-between items-center dark:border-white/5 dark:bg-white/2">
        <span className="text-xs text-gray-500">
          Total: {orders.length} pedidos
        </span>
        <span
          onClick={loadOrders}
          className="text-gray-500 hover:bg-primary/50 hover:text-text-light rounded-full flex items-center justify-center p-2 cursor-pointer transition-colors dark:hover:text-black"
        >
          <IconRotate stroke={2} className={isLoading ? "animate-spin" : ""} />
        </span>
      </div>
    </div>
  );
}
