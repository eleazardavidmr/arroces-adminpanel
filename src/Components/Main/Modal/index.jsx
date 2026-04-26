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
import { ProductContext } from "../../Context";
import { useContext } from "react";
export default function Modal() {
  const { orderToDelete, setOrderToDelete, isDeleting, confirmDelete } =
    useContext(ProductContext);
  return (
    orderToDelete && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/80 dark:bg-[#15100a]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-surface-light border border-border-light/20 dark:bg-background-dark dark:border-background-dark/20 p-6 text-left shadow-2xl shadow-black/50 transition-all scale-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-medium leading-6 text-text-light dark:text-background-light flex items-center gap-2">
              <IconAlertTriangle
                className="text-primary dark:text-background-dark" // Icono de alerta en primary para claro y primary para oscuro. Ajustado para reflejar el color especificado.
                stroke={2}
              />
              Confirmar eliminación
            </h3>
            <button
              onClick={() => setOrderToDelete(null)}
              className="text-gray-500 hover:text-text-dark dark:hover:text-background-dark transition-colors"
            >
              <IconX size={20} />
            </button>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¿Estás seguro de que deseas eliminar el pedido{" "}
              <span className="font-mono text-primary dark:text-background-dark font-bold">
                #{orderToDelete.slice(0, 6)}
              </span>
              ? Esta acción no se puede deshacer.
            </p>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              className="inline-flex justify-center rounded-lg border border-background-dark/10 bg-background-dark/5 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-background-dark/10 hover:text-text-light focus:outline-none transition-colors dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
              onClick={() => setOrderToDelete(null)}
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="inline-flex justify-center items-center gap-2 rounded-lg border border-transparent bg-red-500/10 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white transition-all dark:text-red-500 dark:hover:bg-red-500"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Sí, eliminar"}
            </button>
          </div>
        </div>
      </div>
    )
  );
}
