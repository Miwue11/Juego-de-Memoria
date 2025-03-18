import { tablero } from "./modelo";
import {
  iniciaPartida,
  sePuedeVoltearLaCarta,
  voltearLaCarta,
  parejaNoEncontrada,
} from "./motor";

const DURACION_FLIP = 400;
const MITAD_FLIP = DURACION_FLIP / 2;
const TIEMPO_ESPERA = 800;

let turnoEnProceso = false;

export const iniciarJuego = (): void => {
  iniciaPartida(tablero);
  configurarCartas();
  turnoEnProceso = false;
};

const configurarCartas = (): void => {
  const container = document.querySelector<HTMLDivElement>(".container");
  if (!container) return;

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
  if (turnoEnProceso) return;

  if (tablero.cartas[indice].estaVuelta) {
    mostrarMensaje("La carta ya está volteada.", true);
    return;
  }

  if (!sePuedeVoltearLaCarta(tablero, indice)) return;

  voltearLaCarta(tablero, indice);

  const imagen = cartaDiv.querySelector<HTMLImageElement>("img");
  if (!imagen) return;

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
