import { tablero } from "./modelo";
import {
  iniciaPartida,
  sePuedeVoltearLaCarta,
  voltearLaCarta,
  parejaNoEncontrada,
} from "./motor";

// Constantes de tiempo (en milisegundos)
const DURACION_FLIP = 400; // Duración total de la animación (0.4 s)
const MITAD_FLIP = DURACION_FLIP / 2; // 200 ms para cambiar la imagen
const TIEMPO_ESPERA = 800; // Tiempo que se muestran ambas cartas si no son pareja (0.8 s)

// Variable para evitar clics adicionales durante el turno
let turnoEnProceso = false;

// Función que inicia el juego (se llama desde shell.ts)
export const iniciarJuego = (): void => {
  iniciaPartida(tablero);
  configurarCartas();
  turnoEnProceso = false;
};

const configurarCartas = (): void => {
  const container = document.querySelector<HTMLDivElement>(".container");
  if (!container) return;
  // Reconstruye el contenido del contenedor para que tenga dos cartas.
  container.innerHTML = `
    <div><img class="card-image" src="/img/pngint.png" alt="Carta" /></div>
    <div><img class="card-image" src="/img/pngint.png" alt="Carta" /></div>
  `;
  const cartasDiv = container.querySelectorAll<HTMLDivElement>("div");
  cartasDiv.forEach((cartaDiv, indice) => {
    cartaDiv.addEventListener("click", () => onCartaClic(indice, cartaDiv));
  });
};

const onCartaClic = (indice: number, cartaDiv: HTMLDivElement): void => {
  // Evita clics si ya se está procesando el turno o si la partida ha terminado.
  if (turnoEnProceso) return;

  // Si la carta ya está volteada, muestra un aviso por 400 ms.
  if (tablero.cartas[indice].estaVuelta) {
    mostrarMensaje("La carta ya está volteada.", true);
    return;
  }

  // Verifica si se puede voltear la carta.
  if (!sePuedeVoltearLaCarta(tablero, indice)) return;

  // Marca la carta como volteada en el modelo.
  voltearLaCarta(tablero, indice);

  // Obtiene la imagen del contenedor.
  const imagen = cartaDiv.querySelector<HTMLImageElement>("img");
  if (!imagen) return;

  // Aplica la animación de flip.
  imagen.classList.add("flip");
  setTimeout(() => {
    imagen.src = tablero.cartas[indice].imagen;
  }, MITAD_FLIP);
  imagen.addEventListener(
    "animationend",
    () => {
      imagen.classList.remove("flip");
    },
    { once: true }
  );

  // Control del turno con switch.
  switch (tablero.estadoPartida) {
    case "CeroCartasLevantadas":
      tablero.indiceCartaVolteadaA = indice;
      tablero.estadoPartida = "UnaCartaLevantada";
      break;
    case "UnaCartaLevantada":
      turnoEnProceso = true;
      tablero.indiceCartaVolteadaB = indice;
      tablero.estadoPartida = "DosCartasLevantadas";
      const indiceA = tablero.indiceCartaVolteadaA!;
      const indiceB = tablero.indiceCartaVolteadaB!;

      // Dado que las cartas son siempre distintas, no forman pareja.
      setTimeout(() => {
        parejaNoEncontrada(tablero, indiceA, indiceB);
        actualizarImagenCarta(indiceA, "/img/pngint.png");
        actualizarImagenCarta(indiceB, "/img/pngint.png");
      }, TIEMPO_ESPERA);

      setTimeout(() => {
        tablero.indiceCartaVolteadaA = undefined;
        tablero.indiceCartaVolteadaB = undefined;
        tablero.estadoPartida = "CeroCartasLevantadas";
        turnoEnProceso = false;
      }, TIEMPO_ESPERA);
      break;
    default:
      break;
  }
};

const actualizarImagenCarta = (indice: number, src: string): void => {
  const container = document.querySelector<HTMLDivElement>(".container");
  if (!container) return;
  const cartasDiv = container.querySelectorAll<HTMLDivElement>("div");
  const cartaDiv = cartasDiv[indice];
  const imagen = cartaDiv.querySelector<HTMLImageElement>("img");
  if (imagen) {
    imagen.src = src;
  }
};

// Función para mostrar un mensaje de aviso; si autoClear es true, se borra en 400 ms.
const mostrarMensaje = (texto: string, autoClear: boolean = true): void => {
  const mensaje = document.getElementById("mensaje");
  if (mensaje) {
    mensaje.textContent = texto;
    if (autoClear) {
      setTimeout(() => {
        mensaje.textContent = "";
      }, 400);
    }
  }
};
