import { useContext, useState } from "react";
import { ProductContext } from "../Context";
import { IconUser } from "@tabler/icons-react";
import { IconEye } from "@tabler/icons-react";
import { IconEyeOff } from "@tabler/icons-react";
export default function Login() {
  const $user = "sara";
  const $password = "password123";
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [passwordIcon, setPasswordIcon] = useState("eye");
  const context = useContext(ProductContext);
  const checkCredentials = () => {
    return user === $user && password === $password;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkCredentials()) {
      context.setIsLoggedIn(true);
    } else {
      alert("Invalid username or password.");
    }
  };

  const handlePasswordVisibility = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      setPasswordIcon("eye-off");
    } else {
      setPasswordType("password");
      setPasswordIcon("eye");
    }
  };
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-zinc-100/50 p-4 dark:bg-background-dark/50">
      <div
        className="absolute inset-0 z-[-1] h-full w-full bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
        }}
      ></div>
      <div className="w-full max-w-md rounded-xl bg-background-light/80 p-6 shadow-2xl backdrop-blur-sm dark:bg-background-dark/80 md:p-8">
        <div className="flex flex-col items-center gap-2 pb-6">
          <div className="text-primary">
            <span>
              <IconUser stroke={2} width={48} height={48} />
            </span>
          </div>
          <div className="flex flex-col gap-3 text-center">
            <p className="text-3xl font-black tracking-[-0.033em] text-zinc-900 dark:text-white">
              Acceso al Panel
            </p>
            <p className="text-base font-normal leading-normal text-zinc-600 dark:text-[#c9b392]">
              Bienvenido de nuevo, por favor inicie sesión.
            </p>
          </div>
        </div>
        <form action="" onSubmit={(e) => handleSubmit(e)}>
          <div className="flex flex-col gap-4">
            <label className="flex flex-1 flex-col">
              <p className="pb-2 text-base font-medium text-zinc-900 dark:text-white">
                Usuario o Correo Electrónico
              </p>
              <input
                className="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-zinc-300 bg-white p-[15px] text-base font-normal leading-normal text-zinc-900 placeholder:text-zinc-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/40 dark:border-[#675232] dark:bg-[#332919] dark:text-white dark:placeholder:text-[#c9b392] dark:focus:border-primary"
                onChange={(e) => setUser(e.target.value)}
                placeholder="Introduzca su usuario o correo electrónico"
                value={user}
              />
            </label>
            <label className="flex flex-1 flex-col">
              <p className="pb-2 text-base font-medium text-zinc-900 dark:text-white">
                Contraseña
              </p>
              <div className="flex w-full flex-1 items-stretch rounded-lg">
                <input
                  className="form-input flex h-14 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg border border-r-0 border-zinc-300 bg-white p-[15px] pr-2 text-base font-normal leading-normal text-zinc-900 placeholder:text-zinc-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/40 dark:border-[#675232] dark:bg-[#332919] dark:text-white dark:placeholder:text-[#c9b392] dark:focus:border-primary"
                  placeholder="Introduzca su contraseña"
                  type={passwordType}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                <div className="flex cursor-pointer items-center justify-center rounded-r-lg border border-l-0 border-zinc-300 bg-white pr-[15px] text-zinc-500 hover:text-zinc-700 dark:border-[#675232] dark:bg-[#332919] dark:text-[#c9b392] dark:hover:text-white">
                  <span onClick={handlePasswordVisibility}>
                    {passwordIcon === "eye" ? (
                      <IconEyeOff stroke={2} />
                    ) : (
                      <IconEye stroke={2} />
                    )}
                  </span>
                </div>
              </div>
            </label>
          </div>
          <div className="flex flex-col items-center gap-4 pt-6">
            <button
              type="submit"
              className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-primary/30 dark:text-[#221b11]"
            >
              <span className="truncate">Iniciar Sesión</span>
            </button>
            <a
              className="text-sm font-medium text-zinc-600 hover:text-primary dark:text-[#c9b392] dark:hover:text-primary"
              href="#"
            >
              ¿Olvidó su contraseña?
            </a>
          </div>
        </form>
        <div className="mt-8 border-t border-zinc-200 pt-4 text-center dark:border-zinc-700">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            © 2024 Arroces con Leche. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
