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
import { useState, useContext } from "react";
import { ProductContext } from "../Context";
import StatusBadge from "./StatusBadge";
import { db } from "../../firebaseConfig";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
export default function Table() {
  const context = useContext(ProductContext);
  const [isLoading, setIsLoading] = useState(true);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOrderSelected, setIsOrderSelected] = useState(false);
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
    const previousOrders = [...context.orders];
    const updatedOrders = context.orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          orderInfo: { ...order.orderInfo, status: newStatus },
        };
      }
      return order;
    });

    context.setOrders(updatedOrders);

    try {
      const orderDocRef = doc(db, "orders", orderId);
      await updateDoc(orderDocRef, { "orderInfo.status": newStatus });
    } catch (error) {
      console.error("Error update:", error);
      context.setOrders(previousOrders);
      alert("Error al actualizar estado");
    }
  };

  const promptDelete = (orderId) => {
    setOrderToDelete(orderId);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "orders", orderToDelete));
      context.setOrders((prevOrders) =>
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

  const handleSelectAllOrders = (e) => {
    const isChecked = e.target.checked;
    console.log(
      isChecked
        ? "Seleccionar todos los pedidos"
        : "Deseleccionar todos los pedidos",
    );
    setIsOrderSelected(isChecked);
  };

  return (
    <div className="flex-1 overflow-hidden rounded-xl border border-border-light bg-surface-light shadow-xl flex flex-col relative dark:border-white/5 dark:bg-white/2">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="bg-background-light/50 text-xs uppercase text-gray-600 font-semibold tracking-wider sticky top-0 backdrop-blur-md dark:bg-white/5 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4">
                <input
                  type="checkbox"
                  name="all-orders"
                  onChange={(e) => handleSelectAllOrders(e)}
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
            ) : context.orders.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No hay pedidos registrados.
                </td>
              </tr>
            ) : (
              context.orders.map((order) => (
                <tr
                  className="hover:bg-primary/5 transition-colors group dark:hover:bg-white/3"
                  key={order.id}
                >
                  <td className="px-6 py-4">
                    <input type="checkbox" checked={isOrderSelected} />
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
                        onClick={() => promptDelete(order.id)}
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
          Total: {context.orders.length} pedidos
        </span>
        <span
          onClick={() => context.loadOrders()}
          className="text-gray-500 hover:bg-primary/50 hover:text-text-light rounded-full flex items-center justify-center p-2 cursor-pointer transition-colors dark:hover:text-black"
        >
          <IconRotate stroke={2} className={isLoading ? "animate-spin" : ""} />
        </span>
      </div>
    </div>
  );
}
