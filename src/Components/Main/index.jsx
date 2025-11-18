import { IconShoppingCart } from "@tabler/icons-react";
import { IconFolder } from "@tabler/icons-react";
import { IconUsersGroup } from "@tabler/icons-react";
import { IconSettings } from "@tabler/icons-react";
import { IconLogout2 } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { IconChevronLeft } from "@tabler/icons-react";
import { use, useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore"; // Agregado getDoc para verificación
import { ProductContext } from "../Context";

export default function Main() {
  const [orders, setOrders] = useState([]);
  const context = useContext(ProductContext);

  const loadOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const DBorders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(DBorders);
    } catch (e) {
      console.error("Error getting documents: ", e);
    }
  };

  console.log(orders);

  useEffect(() => {
    loadOrders();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("es-ES");
  };

  const setOrderAsCompleted = async (orderId) => {
    // Guardamos snapshot para poder revertir si falla la escritura en BD
    const previousOrders = orders;
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          orderInfo: {
            ...order.orderInfo,
            status: "completed",
          },
        };
      }
      return order;
    });

    // Actualización optimista en UI
    setOrders(updatedOrders);

    try {
      // Verificar si el documento existe antes de actualizar
      const orderDocRef = doc(db, "orders", orderId);
      const orderDocSnap = await getDoc(orderDocRef);

      if (!orderDocSnap.exists()) {
        throw new Error("El documento no existe en la base de datos.");
      }

      // Actualizar en la base de datos
      await updateDoc(orderDocRef, {
        "orderInfo.status": "completed",
      });
      console.log("Orden actualizada a completada en la BD");
    } catch (error) {
      console.error("Error al actualizar la orden en la BD:", error);
      // Revertir el estado local si falla
      setOrders(previousOrders);
      alert(
        `Error al actualizar el estado de la orden: ${error.message}. Inténtalo de nuevo.`
      );
    }
  };

  return (
    <main className="flex items-center justify-between h-screen">
      <aside className="flex w-70 flex-col border-r border-gray-200/10 bg-white/5 p-4 h-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  "url('https://avatars.githubusercontent.com/u/9919?s=200&v=4')",
              }}
            ></div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-medium leading-normal">
                Sara
              </h1>
              <p className="text-gray-400 dark:text-gray-500 text-sm font-normal leading-normal">
                sara@arrozconleche.com
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a
              className="flex items-center gap-3 rounded-lg bg-primary/20 px-3 py-2 text-primary"
              href="#"
            >
              <span>
                <IconShoppingCart stroke={2} />
              </span>
              <p className="text-sm font-medium leading-normal">Pedidos</p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 text-white/70 hover:bg-white/10 rounded-lg"
              href="#"
            >
              <span>
                <IconFolder stroke={2} />
              </span>
              <p className="text-sm font-medium leading-normal">Productos</p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 text-white/70 hover:bg-white/10 rounded-lg"
              href="#"
            >
              <span>
                <IconUsersGroup stroke={2} />
              </span>
              <p className="text-sm font-medium leading-normal">Clientes</p>
            </a>
          </div>
        </div>
        <div className="mt-auto flex flex-col gap-1">
          <a
            className="flex items-center gap-3 px-3 py-2 text-white/70 hover:bg-white/10 rounded-lg"
            href="#"
          >
            <span>
              <IconSettings stroke={2} />
            </span>
            <p className="text-sm font-medium leading-normal">Configuración</p>
          </a>
          <button
            className="flex items-center gap-3 px-3 py-2 text-white/70 hover:bg-white/10 rounded-lg"
            href="#"
            onClick={() => context.setIsLoggedIn(false)}
          >
            <span>
              <IconLogout2 stroke={2} />
            </span>
            <p className="text-sm font-medium leading-normal">Salir</p>
          </button>
        </div>
      </aside>

      <main className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center justify-between gap-4  pb-6">
          <p className="text-white text-3xl font-bold leading-tight">
            Gestión de Pedidos
          </p>
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="overflow-hidden rounded-xl border border-gray-200/10 bg-white/5">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">
                    ID Pedido
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">
                    Nombre del Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">
                    Celular
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">
                    Domicilio
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">
                    Dirreción
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">
                    Cantidad
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">
                    Pago
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">
                    Estado del Pedido
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/10">
                {orders.map((order) => {
                  console.log(order.userInfo.delivery);
                  return (
                    <tr className="hover:bg-white/5" key={order.id}>
                      <td className="px-4 py-4 text-sm text-gray-400">
                        #{order.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">
                        {formatDate(order.date)}
                      </td>
                      <td className="px-4 py-4 text-sm text-white">
                        {order.userInfo.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-white">
                        {order.userInfo.phone}
                      </td>
                      <td className="px-4 py-4 text-sm text-white">
                        {order.userInfo.delivery ? "Si" : "No"}
                      </td>
                      <td className="px-4 py-4 text-sm text-white">
                        {order.userInfo.address}
                      </td>
                      <td className="px-4 py-4 text-sm text-white">
                        {order.orderInfo.quantity}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">
                        ${order.orderInfo.total}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">
                        {order.userInfo.payment ===
                        "Transferencia (Nequi, Bancolombia, Davivienda)"
                          ? "Transferencia"
                          : "Efectivo"}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {order.orderInfo.status === "completed" ? (
                          <span className="inline-flex rounded-full bg-green-100/10 px-3 py-1 text-sm font-medium leading-5 text-green-400  items-center justify-center">
                            <div className="w-2 h-2 mr-2 bg-green-400 rounded-full"></div>
                            {order.orderInfo.status}
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-yellow-100/10 px-3 py-1 text-sm font-medium leading-5 text-yellow-400  items-center justify-center">
                            <div className="w-2 h-2 mr-2 bg-yellow-400 rounded-full"></div>
                            {order.orderInfo.status}
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className="text-sm font-medium text-primary hover:underline"
                          onClick={() => setOrderAsCompleted(order.id)}
                        >
                          Poner como completado
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200/10 pt-4 mt-4">
          <p className="text-sm text-gray-400">
            Mostrando <span className="font-medium text-white">1</span> a{" "}
            <span className="font-medium text-white">5</span> de{" "}
            <span className="font-medium text-white">97</span> resultados
          </p>
          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white/10 text-white text-sm font-bold hover:bg-white/20">
              <span className="material-symbols-outlined text-base">
                <IconChevronLeft stroke={2} />
              </span>
            </button>
            <button className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary text-background-dark text-sm font-bold">
              1
            </button>
            <button className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white/10 text-white text-sm font-bold hover:bg-white/20">
              2
            </button>
            <button className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white/10 text-white text-sm font-bold hover:bg-white/20">
              3
            </button>
            <span className="text-gray-400">...</span>
            <button className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white/10 text-white text-sm font-bold hover:bg-white/20">
              20
            </button>
            <button className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white/10 text-white text-sm font-bold hover:bg-white/20">
              <span className="material-symbols-outlined text-base">
                <IconChevronRight stroke={2} />
              </span>
            </button>
          </div>
        </div>
      </main>
    </main>
  );
}
