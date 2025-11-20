import { useContext } from "react";
import { ProductContext } from "../Context";
export default function ChangeOrderStatusModal() {
  const context = useContext(ProductContext);
  return (
    <>
      {context.isChangeStatusModalOpen && (
        <section className="h-screen w-screen fixed inset-0 dark:bg-black/50 backdrop-blur-2xl flex items-center justify-center z-50">
          <div className="bg-background-light rounded-lg p-6 max-w-md mx-auto mt-40 dark:bg-background-dark text-background-dark dark:text-background-light shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Cambiar estado de la orden
            </h2>
            <p className="mb-6">Seleccione el nuevo estado para la orden:</p>
            <div className="flex flex-col gap-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => context.setOrderStatus("Pendiente")}
              >
                Pendiente
              </button>
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => context.setOrderStatus("En preparación")}
              >
                En preparación
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => context.setOrderStatus("Completada")}
              >
                Completada
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
