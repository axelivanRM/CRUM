'use client'
import { useState } from "react";

export default function RegisterForm() {

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [accessPassword, setAccessPassword] = useState("");
const [role, setRole] = useState("");

const handleSubmit = async (e: React.SubmitEvent) => {
  e.preventDefault();

  try{
    const response = await fetch('http://localhost:3000/users/register/admin',{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
            accessPassword
        })
    })

    const data = await response.json();
    console.log(data);
    
    if(!response.ok){
      throw new Error(data.message || "Error en el registro de usurio");
    }

  }catch(error){
    const message =
        error instanceof Error ? error.message : "Error desconocido";
      console.error("Error en el login:", message);
  }
};


  return (
    <div className="container-register">
      <div className="container-title">
        <h1 className="title-register">Registrar un nuevo usuario</h1>
      </div>

      <div className="container-form">
        <form onSubmit={handleSubmit} className="form-component">
          <label className="label-username">Nombre de usuario</label>
          <input
            className="input-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          ></input>

          <label className="label-password">Contraseña</label>
          <input
            className="input-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>

          <label className="label-accesspassword">Contraseña de acceso</label>
          <input
            className="input-accesspassword"
            type="password"
            value={accessPassword}
            onChange={(e) => setAccessPassword(e.target.value)}
            required
          ></input>
            
          <button type= "submit">Registrar</button>
        </form>
      </div>
    </div>
  );
}
