
"use client";

import { useState, FormEvent } from "react";

interface EmergencyFormProps {
  operatorId: number;
}

export default function Home() {
  const [ambulances, setAmbulances] = useState({
    transfer: 0,
    basic: 1,
    advanced: 1,
    intensive: 0,
  });

  const updateAmbulance = (
    type: keyof typeof ambulances,
    increment: number
  ) => {
    setAmbulances((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + increment),
    }));
  };

  
const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const emergency = {
    operatorId: Number(formData.get("operatorId")),
    contactPhone: formData.get("contactPhone") as string,
    emergencyType: formData.get("emergencyType") as "HIGH" | "MEDIUM" | "LOW",
    description: formData.get("description") || null,
    latitude: Number(formData.get("latitude")),
    longitude: Number(formData.get("longitude")),
    ignoreDuplicates: formData.has("ignoreDuplicates"),
    ambulances,
  };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/emergencies/new`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(emergency),
      }
    );

    const data = await response.json();

    console.log(data);
};


  const ambulanceTypes = [
    { key: "transfer", label: "De traslado" },
    { key: "basic", label: "Urgencias básicas" },
    { key: "advanced", label: "Urgencias avanzadas" },
    { key: "intensive", label: "Cuidados intensivos" },
  ] as const;

  return (
    <main>
      <header>
        <h1>Nueva emergencia</h1>
      </header>

      <form onSubmit={handleSubmit}>

        <section>
          <h2>Ubicación</h2>

          <label htmlFor="operatorId">
            ID del operador
          </label>
          
          <input
            type="number"
            id="operatorId"
            name="operatorId"
          />

          <label htmlFor="address">
            Dirección del incidente
          </label>

          <input
            type="text"
            id="address"
            name="address"
            placeholder="Buscar dirección o lugar..."
            required
          />

          <div>
            <label htmlFor="latitude">Latitud</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              step="any"
              min={-90}
              max={90}
              placeholder="19.432608"
              required
            />

            <label htmlFor="longitude">Longitud</label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              step="any"
              min={-180}
              max={180}
              placeholder="-99.133209"
              required
            />
          </div>
        </section>

        <section>
          <h2>Contacto</h2>

          <label htmlFor="contactPhone">
            Teléfono de contacto
          </label>

          <input
            type="tel"
            id="contactPhone"
            name="contactPhone"
            maxLength={20}
            placeholder="Número telefónico"
            required
          />
        </section>

        <section>
          <h2>Descripción</h2>

          <label htmlFor="description">
            Descripción del incidente
          </label>

          <textarea
            id="description"
            name="description"
            placeholder="Describe brevemente lo sucedido..."
          />
        </section>

        <section>
          <h2>Tipo de emergencia</h2>

          <fieldset>
            <legend>Selecciona la prioridad</legend>

            <div>
              <input
                type="radio"
                id="high"
                name="emergencyType"
                value="HIGH"
                required
              />
              <label htmlFor="high">Prioridad alta</label>
            </div>

            <div>
              <input
                type="radio"
                id="medium"
                name="emergencyType"
                value="MEDIUM"
              />
              <label htmlFor="medium">Prioridad media</label>
            </div>

            <div>
              <input
                type="radio"
                id="low"
                name="emergencyType"
                value="LOW"
              />
              <label htmlFor="low">Prioridad baja</label>
            </div>
          </fieldset>
        </section>

        <section>
          <h2>Ambulancias requeridas</h2>

          {ambulanceTypes.map((ambulance) => (
            <div key={ambulance.key}>
              <label>{ambulance.label}</label>

              <button
                type="button"
                onClick={() => updateAmbulance(ambulance.key, -1)}
                disabled={ambulances[ambulance.key] === 0}
                aria-label={`Reducir ${ambulance.label}`}
              >
                -
              </button>

              <output>
                {ambulances[ambulance.key]}
              </output>

              <button
                type="button"
                onClick={() => updateAmbulance(ambulance.key, 1)}
                aria-label={`Aumentar ${ambulance.label}`}
              >
                +
              </button>
            </div>
          ))}
        </section>

        <section>
          <h2>Validación</h2>

          <input
            type="checkbox"
            id="ignoreDuplicates"
            name="ignoreDuplicates"
          />

          <label htmlFor="ignoreDuplicates">
            Ignorar posibles emergencias duplicadas
          </label>
        </section>

        <footer>
          <button type="submit">
            Confirmar emergencia
          </button>
        </footer>

      </form>
    </main>
  );
}
