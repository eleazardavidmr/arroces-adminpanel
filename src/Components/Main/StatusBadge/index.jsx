export default function StatusBadge({ status }) {
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
}
