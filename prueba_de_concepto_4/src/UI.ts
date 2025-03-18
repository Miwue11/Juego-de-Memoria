import { tablero, infoCartas } from "./modelo";
import {
  iniciaPartida,
  parejaEncontrada,
  parejaNoEncontrada,
  sePuedeVoltearLaCarta,
  sonPareja,
  voltearLaCarta,
} from "./motor";
const DURACION_FLIP = 150;
const TIEMPO_ESPERA = 1000;

let turnoEnProceso: boolean = false;

export const iniciarPartida = (): void => {
  iniciaPartida();
  configurarCartas();
};

const configurarCartas = (): void => {
  const cartasDiv =
    document.querySelectorAll<HTMLDivElement>(".container > div");
  cartasDiv.forEach((cartaDiv, indice) => {
    const imagen = cartaDiv.querySelector<HTMLImageElement>("img");
    if (imagen) {
      imagen.src = "/img/pngint.png";
      imagen.classList.remove("flip");
      imagen.setAttribute(
        "data-id-imagen",
        tablero.cartas[indice].idFoto.toString()
      );
    }
    cartaDiv.onclick = null;
    cartaDiv.onclick = () => CartaClick(indice, cartaDiv);
  });
};

export const girarCarta = (indice: number): void => {
  const cartaImg = document.querySelector(
    `img[data-id-carta="${indice}"]`
  ) as HTMLImageElement;
  if (cartaImg) {
    cartaImg.src = infoCartas[indice].imagen;
    cartaImg.classList.remove("flip");
    setTimeout(() => {
      cartaImg.classList.add("flip");
    }, 50);
  } else {
    console.error(
      `No se encontró la imagen para la carta con índice ${indice}`
    );
  }
};

const CartaClick = (indice: number, cartaDiv: HTMLDivElement): void => {
  if (tablero.estadoPartida === "PartidaCompleta" || turnoEnProceso) return;

  if (tablero.cartas[indice].estaVuelta) {
    return;
  }
  if (!sePuedeVoltearLaCarta(tablero, indice)) return;

  voltearLaCarta(indice);

  const imagen = cartaDiv.querySelector<HTMLImageElement>("img");
  if (!imagen) return;
  imagen.classList.add("flip");
  setTimeout(() => {
    const idImagen = imagen.getAttribute("data-id-imagen");
    if (idImagen) {
      const idNumerico = parseInt(idImagen, 10);
      const info = infoCartas.find((c) => c.idFoto === idNumerico);
      if (info) {
        imagen.src = info.imagen;
      }
    }
  }, DURACION_FLIP);
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
      if (sonPareja(indiceA, indiceB)) {
        parejaEncontrada(indiceA, indiceB);
      } else {
        setTimeout(() => {
          parejaNoEncontrada(tablero, indiceA, indiceB);
          ocultarCarta(indiceA);
          ocultarCarta(indiceB);
        }, TIEMPO_ESPERA);
      }
      setTimeout(() => {
        tablero.indiceCartaVolteadaA = undefined;
        tablero.indiceCartaVolteadaB = undefined;
        turnoEnProceso = false;
        tablero.estadoPartida = "CeroCartasLevantadas";
      }, TIEMPO_ESPERA);
      break;
  }
};

export const ocultarCarta = (indice: number): void => {
  const cartaImg = document.querySelector(
    `img[data-id-carta="${indice}"]`
  ) as HTMLImageElement;
  if (cartaImg) {
    cartaImg.src = "/img/pngint.png";
    cartaImg.classList.remove("flip");
  } else {
    console.error(
      `No se encontró la imagen para la carta con índice ${indice}`
    );
  }
};
