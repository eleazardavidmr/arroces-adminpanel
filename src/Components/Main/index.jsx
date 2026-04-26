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
import Metrics from "./Metrics";
import Modal from "./Modal";

// Badge de estado
const StatusBadge = ({ status }) => {};

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
