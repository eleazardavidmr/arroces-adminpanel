import { useContext, useState } from "react";
import { ProductContext } from "../Context";
import {
  IconUser,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconLock,
  IconChefHat,
} from "@tabler/icons-react";

export default function Login() {
  // ⚠️ RECORDATORIO: Estas credenciales son de prueba.
  const $user = "sara";
  const $password = "password123";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Conexión con tu Contexto global
  const context = useContext(ProductContext);

  const checkCredentials = () => {
    return username === $user && password === $password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulación de tiempo de carga (puedes eliminar esto si conectas una API real)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (checkCredentials()) {
      context.setIsLoggedIn(true);
    } else {
      setError("Credenciales incorrectas. Intenta con: sara / password123");
      setIsLoading(false);
    }
  };

  const handlePasswordVisibility = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#221b10] p-4 overflow-hidden text-[#f8f7f6]">
      {/* --- FONDO AMBIENTAL --- */}
      <div
        className="absolute inset-0 z-0 h-full w-full bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')",
        }}
      ></div>
      {/* Gradiente superpuesto para mejorar la lectura del texto sobre la imagen */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#221b10] via-[#221b10]/90 to-[#221b10]/60"></div>

      {/* --- TARJETA DE LOGIN --- */}
      <div className="relative z-10 w-full max-w-md transform overflow-hidden rounded-2xl border border-primary/20 bg-[#221b10]/80 p-8 shadow-2xl backdrop-blur-md transition-all">
        {/* Encabezado con Icono */}
        <div className="flex flex-col items-center gap-4 pb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/40 shadow-[0_0_15px_rgba(236,149,19,0.2)]">
            <IconChefHat className="text-primary" stroke={1.5} size={32} />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#f8f7f6]">
              Bienvenida
            </h1>
            <p className="mt-2 text-sm font-medium text-primary/80 uppercase tracking-widest">
              Panel Administrativo
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Input Usuario */}
          <div className="space-y-2">
            <label
              htmlFor="username-input"
              className="text-sm font-medium text-gray-300 ml-1"
            >
              Usuario
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-focus-within:text-primary transition-colors">
                <IconUser size={20} stroke={1.5} />
              </div>
              <input
                id="username-input"
                type="text"
                className="w-full rounded-xl border border-white/10 bg-[#15100a] py-3.5 pl-11 pr-4 text-[#f8f7f6] placeholder-gray-600 outline-none transition-all focus:border-primary/50 focus:bg-[#1a140e] focus:ring-1 focus:ring-primary/50"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Input Contraseña */}
          <div className="space-y-2">
            <label
              htmlFor="password-input"
              className="text-sm font-medium text-gray-300 ml-1"
            >
              Contraseña
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-focus-within:text-primary transition-colors">
                <IconLock size={20} stroke={1.5} />
              </div>
              <input
                id="password-input"
                type={passwordType}
                className="w-full rounded-xl border border-white/10 bg-[#15100a] py-3.5 pl-11 pr-12 text-[#f8f7f6] placeholder-gray-600 outline-none transition-all focus:border-primary/50 focus:bg-[#1a140e] focus:ring-1 focus:ring-primary/50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />

              {/* Botón para mostrar/ocultar contraseña */}
              <button
                type="button"
                onClick={handlePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-[#f8f7f6] transition-colors focus:outline-none"
                tabIndex="-1"
              >
                {passwordType === "password" ? (
                  <IconEye size={20} stroke={1.5} />
                ) : (
                  <IconEyeOff size={20} stroke={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Mensaje de Error (Solo aparece si hay error) */}
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-sm font-medium text-red-400 animate-pulse">
              {error}
            </div>
          )}

          {/* Botón de Ingreso */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center rounded-xl bg-primary py-3.5 text-base font-bold text-[#221b10] shadow-lg shadow-primary/20 transition-all hover:bg-[#d6850e] hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <IconLoader2 className="animate-spin" stroke={2} size={20} />
                <span>Verificando...</span>
              </div>
            ) : (
              "Ingresar al Sistema"
            )}
          </button>
        </form>

        {/* Footer pequeño */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2024 Arroces con Leche. <br /> Acceso restringido solo para
            personal autorizado.
          </p>
        </div>
      </div>
    </div>
  );
}
