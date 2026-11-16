"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  // States for the inputs (initially empty)
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState<boolean | null>(null);

  //function to determine if an administrator exists

  useEffect(() => {
    const verifyAdminExists = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/exist-admin");
        const data = await response.json();
        setAdmin(data.admin);
      } catch (error) {
        console.error("Error verificando admin:", error);
        setAdmin(true);
      }
    };

    verifyAdminExists();
  }, []);

  // Function that executes when the form is submitted
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    console.log("Usuario:", user);
    console.log("Contraseña:", password);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user,
          password: password,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Error en el login");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      console.error("Error en el login:", message);
    }
    // Aquí irá la conexión al backend después
  };

  return (
    <div className="container-login">
      <div className="container-title">
        <h1 className="title-login">CRUM</h1>
        <p className="subtitle-login">Centro Regulador de Urgencias Médicas</p>
      </div>

      <div className="container-form">
        <form onSubmit={handleSubmit} className="form-component">
          <label className="label-user">Usuario</label>
          <input
            className="input-user"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />

          <label className="label-password">Contraseña</label>
          <input
            className="input-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* El botón ahora está DENTRO del form */}
          <div className="container-submit">
            <button type="submit">Iniciar Sesión</button>
          </div>
        </form>
      </div>

      {!admin && (
        <div className="container-register">
          <label className="label-register">
            <Link href="/registerUser" className="a-register">
              Registrarse
            </Link>
          </label>
        </div>
      )}
    </div>
  );
}
