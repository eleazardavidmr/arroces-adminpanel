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
import { useContext, useState, useMemo } from "react";
import { ProductContext } from "../Context";
import Table from "./Table";
import { ProductContext } from "../Context";
import Metrics from "./Metrics";
import Modal from "./Modal";

// Badge de estado
const StatusBadge = ({ status }) => {
  const styles = {
    Completada: "bg-green-500/20 text-green-400",
    Pendiente: "bg-yellow-500/20 text-yellow-400",
    "En preparación": "bg-blue-500/20 text-blue-400",
    Lista: "bg-teal-500/20 text-teal-400", // Nuevo estado agregado
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
  const context = useContext(ProductContext);

  return (
    <main className="flex h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark relative selection:bg-background-dark selection:text-primary dark:selection:bg-background-light">
      {/* --- MODAL --- */}
      <Modal />
      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex flex-1 flex-col p-4 md:p-6 overflow-hidden">
        <header className="flex items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-light dark:text-background-light">
              Gestión de Pedidos
            </h1>
          </div>
        </header>
        <Metrics />
        <Table />
      </main>
    </main>
  );
}
