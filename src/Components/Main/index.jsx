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
  IconSoup, // Nuevo icono para el arroz
  IconCash, // Nuevo icono para el dinero
} from "@tabler/icons-react";
import { useContext, useEffect, useState, useMemo } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ProductContext } from "../Context";

// Badge de estado
const StatusBadge = ({ status }) => {
  const styles = {
    Completada: "bg-green-500/20 text-green-400",
    Pendiente: "bg-yellow-500/20 text-yellow-400",
    "En preparación": "bg-blue-500/20 text-blue-400",
    Cancelada: "bg-red-500/20 text-red-400",
  };
  const baseStyle =
    "inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium leading-5 backdrop-blur-sm border border-white/5";
  const activeStyle = styles[status] || "bg-gray-500/20 text-gray-400";

  return (
    <span className={`${baseStyle} ${activeStyle}`}>
      <div className={`w-2 h-2 mr-2 rounded-full bg-current`}></div>
      {status || "Desconocido"}
    </span>
  );
};

export default function Main() {
  const [orders, setOrders] = useState([]);
  const [isAsideOpen, setIsAsideOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const context = useContext(ProductContext);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const DBorders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Opcional: Ordenar por fecha si tienes el campo date
      // DBorders.sort((a, b) => b.date - a.date);
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

  // --- NUEVA LÓGICA: CÁLCULO DE TOTALES ---
  const metrics = useMemo(() => {
    const totalQuantity = orders.reduce((sum, order) => {
      // Aseguramos que sea un número
      const qty = parseInt(order.orderInfo?.quantity) || 0;
      // Solo sumamos si la orden NO está cancelada (opcional, depende de tu regla de negocio)
      if (order.orderInfo?.status === "Cancelada") return sum;
      return sum + qty;
    }, 0);

    const totalRevenue = orders.reduce((sum, order) => {
      const total = parseInt(order.orderInfo?.total) || 0;
      if (order.orderInfo?.status === "Cancelada") return sum;
      return sum + total;
    }, 0);

    return { totalQuantity, totalRevenue };
  }, [orders]);
  // -----------------------------------------

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

  const promptDelete = (orderId) => {
    setOrderToDelete(orderId);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "orders", orderToDelete));
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderToDelete)
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
    <main className="flex h-screen bg-background-dark text-background-light relative selection:bg-background-dark selection:text-primary ">
      {/* --- MODAL --- */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#15100a]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-background-dark border border-background-dark/20 p-6 text-left shadow-2xl shadow-black/50 transition-all scale-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-medium leading-6 text-background-light flex items-center gap-2">
                <IconAlertTriangle
                  className="text-background-dark"
                  stroke={2}
                />
                Confirmar eliminación
              </h3>
              <button
                onClick={() => setOrderToDelete(null)}
                className="text-gray-500 hover:text-background-dark transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-400">
                ¿Estás seguro de que deseas eliminar el pedido{" "}
                <span className="font-mono text-background-dark font-bold">
                  #{orderToDelete.slice(0, 6)}
                </span>
                ? Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                className="inline-flex justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white focus:outline-none transition-colors"
                onClick={() => setOrderToDelete(null)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="inline-flex justify-center items-center gap-2 rounded-lg border border-transparent bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500 hover:text-white transition-all"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      {isAsideOpen && (
        <aside className="flex w-64 flex-col border-r border-white/5 bg-background-dark p-4 h-full">
          <div className="flex flex-col gap-6">
            {/* Perfil */}
            <div className="flex items-center gap-3 px-2">
              <div className="h-10 w-10 rounded-full border-2 border-background-dark/20 bg-gray-700 bg-[url('https://avatars.githubusercontent.com/u/9919?s=200&v=4')] bg-cover bg-center"></div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold text-background-light">
                  Sara
                </h1>
                <p className="text-xs text-background-dark">Administradora</p>
              </div>
            </div>

            {/* Navegación */}
            <nav className="flex flex-col gap-2">
              <a
                className="flex items-center gap-3 rounded-lg bg-background-dark/10 border border-background-dark/20 px-3 py-2 text-background-dark"
                href="#"
              >
                <IconShoppingCart size={20} stroke={2} />
                <span className="text-sm font-medium">Pedidos</span>
              </a>
              <a
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:bg-white/5 hover:text-background-light transition-colors"
                href="#"
              >
                <IconFolder size={20} stroke={1.5} />
                <span className="text-sm font-medium">Productos</span>
              </a>
              <a
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:bg-white/5 hover:text-background-light transition-colors"
                href="#"
              >
                <IconUsersGroup size={20} stroke={1.5} />
                <span className="text-sm font-medium">Clientes</span>
              </a>
            </nav>
          </div>

          <div className="mt-auto">
            <button
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-colors"
              onClick={() => context.setIsLoggedIn(false)}
            >
              <IconLogout2 size={20} />
              <span className="text-sm font-medium">Salir</span>
            </button>
          </div>
        </aside>
      )}

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex flex-1 flex-col p-4 md:p-6 overflow-hidden">
        <header className="flex items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg bg-white/5 border border-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-primary transition-colors"
              onClick={() => setIsAsideOpen(!isAsideOpen)}
            >
              {isAsideOpen ? (
                <IconChevronLeft size={20} />
              ) : (
                <IconChevronRight size={20} />
              )}
            </button>
            <h1 className="text-2xl font-bold text-background-light">
              Gestión de Pedidos
            </h1>
          </div>
        </header>

        {/* --- NUEVA SECCIÓN: TARJETAS DE MÉTRICAS (KPIs) --- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
          {/* Tarjeta 1: Total Arroces Vendidos */}
          <div className="rounded-xl border border-white/5 bg-white/2 p-5 shadow-lg flex items-center justify-between backdrop-blur-md">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Arroces Vendidos
              </p>
              <p className="text-3xl font-extrabold text-background-light mt-1">
                {context.formatNumber(metrics.totalQuantity)}
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <IconSoup size={32} stroke={1.5} />
            </div>
          </div>

          {/* Tarjeta 2: Ingreso Total */}
          <div className="rounded-xl border border-white/5 bg-white/2 p-5 shadow-lg flex items-center justify-between backdrop-blur-md">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Ingreso Total
              </p>
              <p className="text-3xl font-extrabold text-primary mt-1">
                $
                {context.formatNumber
                  ? context.formatNumber(metrics.totalRevenue)
                  : metrics.totalRevenue}
              </p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-full text-green-400">
              <IconCash size={32} stroke={1.5} />
            </div>
          </div>
        </div>
        {/* -------------------------------------------------- */}

        {/* Tarjeta de la Tabla */}
        <div className="flex-1 overflow-hidden rounded-xl border border-white/5 bg-white/2 shadow-xl flex flex-col relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-white/5 text-xs uppercase text-gray-400 font-semibold tracking-wider sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4">Pedido</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Ubicación</th>
                  <th className="px-6 py-4 text-center">Cant.</th>
                  <th className="px-6 py-4">Total / Pago</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
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
                      className="hover:bg-white/3 transition-colors group"
                      key={order.id}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-primary">
                            #{order.id.slice(0, 6)}...
                          </span>
                          <span className="text-sm text-gray-400">
                            {formatDate(order.date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-background-light">
                            {order.userInfo.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {order.userInfo.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col max-w-[200px]">
                          <span className="text-sm text-gray-300 truncate">
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
                        <span className="rounded-md bg-white/5 px-2 py-1 text-sm font-bold text-gray-300 border border-white/5">
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
                              className="appearance-none rounded bg-background-dark border border-white/10 px-3 py-1 pr-8 text-xs text-gray-300 focus:outline-none focus:border-primary focus:text-primary cursor-pointer transition-colors"
                              value={order.orderInfo.status}
                              onChange={(e) =>
                                changeOrderStatus(order.id, e.target.value)
                              }
                            >
                              <option
                                className="bg-background-dark"
                                value="Pendiente"
                              >
                                Pendiente
                              </option>
                              <option
                                className="bg-background-dark"
                                value="En preparación"
                              >
                                En preparación
                              </option>
                              <option
                                className="bg-background-dark"
                                value="Completada"
                              >
                                Completada
                              </option>
                              <option
                                className="bg-background-dark"
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
                            className="rounded p-1.5 text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/20"
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
          <div className="border-t border-white/5 bg-white/2 px-6 py-4 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              Total: {orders.length} pedidos
            </span>
            <span
              onClick={() => loadOrders()}
              className="text-gray-500 hover:bg-primary/50 hover:text-black rounded-full flex items-center justify-center p-2 cursor-pointer transition-colors"
            >
              <IconRotate
                stroke={2}
                className={isLoading ? "animate-spin" : ""}
              />
            </span>
          </div>
        </div>
      </main>
    </main>
  );
}
