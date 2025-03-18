import { tablero, infoCartas } from "./modelo";
import {
  iniciaPartida,
  sePuedeVoltearLaCarta,
  voltearLaCarta,
  sonPareja,
  parejaEncontrada,
  parejaNoEncontrada,
  esPartidaCompleta,
} from "./motor";
import { DURACION_FLIP, TIEMPO_ESPERA } from "./constantes";

let turnoEnProceso: boolean = false;

export const iniciarInterfaz = (): void => {
  const btnJugar = document.getElementById("btnJugar");
  const btnReiniciar = document.getElementById("btnReiniciar");
  btnJugar?.addEventListener("click", () => {
    iniciaPartida();
    actualizarContador(0);
    limpiarMensaje();
    configurarCartas();
    (btnJugar as HTMLButtonElement).style.display = "none";
    (btnReiniciar as HTMLButtonElement).style.display = "none";
  });
  btnReiniciar?.addEventListener("click", () => {
    iniciaPartida();
    actualizarContador(0);
    limpiarMensaje();
    configurarCartas();
    turnoEnProceso = false;
    (btnReiniciar as HTMLButtonElement).style.display = "none";
  });
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
  const cartaDiv = document.querySelector(
    `img[data-id-carta="${indice}"]`
  ) as HTMLImageElement;

  if (cartaDiv) {
    const imagen = cartaDiv.querySelector<HTMLImageElement>("img");
    if (imagen) {
      imagen.src = infoCartas[indice].imagen;
      imagen.classList.add("flip");
    } else {
      console.error(
        `No se encontró la imagen en el contenedor con data-id-carta="${indice}"`
      );
    }
  } else {
    console.error(`No se encontró el contenedor con data-id-carta="${indice}"`);
  }
};

const CartaClick = (indice: number, cartaDiv: HTMLDivElement): void => {
  if (tablero.estadoPartida === "PartidaCompleta" || turnoEnProceso) return;

  if (tablero.cartas[indice].estaVuelta) {
    mostrarMensaje("La carta ya está volteada.", true);
    return;
  }
  if (!sePuedeVoltearLaCarta(indice)) return;

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
      const intentosActuales = parseInt(
        document
          .getElementById("contador")
          ?.textContent?.replace("Intentos: ", "") || "0"
      );
      actualizarContador(intentosActuales + 1);
      const indiceA = tablero.indiceCartaVolteadaA!;
      const indiceB = tablero.indiceCartaVolteadaB!;
      if (sonPareja(indiceA, indiceB)) {
        parejaEncontrada(indiceA, indiceB);
      } else {
        setTimeout(() => {
          parejaNoEncontrada(tablero, indiceA, indiceB);
          actualizarImagenCarta(indiceA, "/img/pngint.png");
          actualizarImagenCarta(indiceB, "/img/pngint.png");
        }, TIEMPO_ESPERA);
      }
      setTimeout(() => {
        tablero.indiceCartaVolteadaA = undefined;
        tablero.indiceCartaVolteadaB = undefined;
        if (!esPartidaCompleta()) {
          tablero.estadoPartida = "CeroCartasLevantadas";
        }
        turnoEnProceso = false;
        if (esPartidaCompleta()) {
          tablero.estadoPartida = "PartidaCompleta";
          const btnReiniciar = document.getElementById("btnReiniciar");
          (btnReiniciar as HTMLElement).style.display = "inline-block";
          mostrarMensaje(
            `¡Felicidades! Has completado la partida en ${parseInt(
              document
                .getElementById("contador")
                ?.textContent?.replace("Intentos: ", "") || "0"
            )} intentos!`,
            false
          );
        }
      }, TIEMPO_ESPERA);
      break;
  }
};
const actualizarImagenCarta = (indice: number, src: string): void => {
  const cartaDiv =
    document.querySelectorAll<HTMLDivElement>(".container > div")[indice];
  const imagen = cartaDiv.querySelector<HTMLImageElement>("img");
  if (imagen) {
    imagen.src = src;
  }
};

const actualizarContador = (nuevoNumero: number): void => {
  const contadorElem = document.getElementById("contador");
  if (contadorElem) contadorElem.textContent = "Intentos: " + nuevoNumero;
};

const mostrarMensaje = (texto: string, autoClear: boolean = true): void => {
  const mensajeElem = document.getElementById("mensaje");
  if (mensajeElem) {
    mensajeElem.textContent = texto;
    if (autoClear) {
      setTimeout(() => {
        mensajeElem.textContent = "";
      }, TIEMPO_ESPERA);
    }
  }
};

const limpiarMensaje = (): void => {
  const mensajeElem = document.getElementById("mensaje");
  if (mensajeElem) mensajeElem.textContent = "";
};
