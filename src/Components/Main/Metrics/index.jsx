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
import { useContext, useMemo } from "react";
import { ProductContext } from "../Context";
export default function Metrics() {
  const { orders, formatNumber } = useContext(ProductContext);
  const metrics = useMemo(() => {
    const meta = 50;

    const totalQuantity = orders.reduce((sum, order) => {
      const qty = parseInt(order.orderInfo?.quantity) || 0;
      if (order.orderInfo?.status === "Cancelada") return sum;
      return sum + qty;
    }, 0);

    const totalRevenue = orders.reduce((sum, order) => {
      const total = parseInt(order.orderInfo?.total) || 0;
      if (order.orderInfo?.status === "Cancelada") return sum;
      return sum + total;
    }, 0);

    const faltan = Math.max(meta - totalQuantity, 0);

    return { totalQuantity, totalRevenue, meta, faltan };
  }, [orders]);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
      {/* Tarjeta 1: Total Arroces Vendidos */}
      <div className="group relative w-full overflow-hidden rounded-2xl border border-border-light/60 bg-surface-light p-5 shadow-lg transition-all hover:shadow-xl hover:border-primary/30 dark:border-white/5 dark:bg-white/5 dark:backdrop-blur-xl hover:-translate-y-1">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-widest text-subtle-light dark:text-gray-400">
              Arroces Vendidos
            </p>
            <p className="mt-2 text-3xl font-black text-text-light dark:text-background-light">
              {formatNumber(metrics.totalQuantity)}
            </p>
          </div>
          <div className="rounded-xl bg-primary/10 p-3 text-primary ring-1 ring-inset ring-primary/20 transition-transform group-hover:scale-110 group-hover:rotate-3">
            <IconSoup size={28} stroke={1.5} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-dashed border-border-light dark:border-white/10 pt-3">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Faltan para la meta:{" "}
            <span className="font-bold text-text-light dark:text-white ml-1">
              {metrics.faltan}
            </span>
          </p>
        </div>
      </div>

      {/* Tarjeta 2: Ingreso Total */}
      <div className="group relative w-full overflow-hidden rounded-2xl border border-border-light/60 bg-surface-light p-5 shadow-lg transition-all hover:shadow-xl hover:border-green-500/30 dark:border-white/5 dark:bg-white/5 dark:backdrop-blur-xl hover:-translate-y-1">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-widest text-subtle-light dark:text-gray-400">
              Ingreso Total
            </p>
            <p className="mt-2 text-3xl font-black text-primary">
              ${formatNumber(metrics.totalRevenue)}
            </p>
          </div>
          <div className="rounded-xl bg-green-500/10 p-3 text-green-600 ring-1 ring-inset ring-green-500/20 transition-transform group-hover:scale-110 group-hover:rotate-3 dark:text-green-400">
            <IconCash size={28} stroke={1.5} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-dashed border-border-light dark:border-white/10 pt-3">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Meta del día:{" "}
            <span className="font-bold text-text-light dark:text-white ml-1">
              $300.000
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
