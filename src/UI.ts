import { tablero, infoCartas } from "./modelo";
import { iniciaPartida, sonPareja, esPartidaCompleta } from "./motor";
import { DURACION_FLIP, TIEMPO_ESPERA } from "./constantes";

let turnoEnProceso: boolean = false;

export const iniciarInterfaz = (): void => {
  const btnJugar = document.getElementById("btnJugar");
  const btnReiniciar = document.getElementById("btnReiniciar");
  btnJugar?.addEventListener("click", () => {
    iniciaPartida(tablero);
    actualizarContador(0);
    limpiarMensaje();
    configurarCartas();
    (btnJugar as HTMLButtonElement).style.display = "none";
    (btnReiniciar as HTMLButtonElement).style.display = "none";
  });
  btnReiniciar?.addEventListener("click", () => {
    iniciaPartida(tablero);
    actualizarContador(0);
    limpiarMensaje();
    configurarCartas();
    turnoEnProceso = false;
    (btnReiniciar as HTMLButtonElement).style.display = "none";
  });
  if (!tablero) console.error("Tablero no inicializado");
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
    cartaDiv.onclick = () => cartaClick(indice, cartaDiv);
  });
  if (!cartasDiv) console.error("no se encontraron las cartas");
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

const mostrarImagen = (cartaDiv: HTMLDivElement) => {
  const imagen = cartaDiv.querySelector<HTMLImageElement>("img");
  if (!imagen) return;
  else console.error("No se encontró la imagen");
  imagen.classList.add("flip");
  setTimeout(() => {
    const idImagen = imagen.getAttribute("data-id-imagen");
    if (idImagen) {
      const idNumerico = parseInt(idImagen, 10);
      const info = infoCartas.find((c) => c.idFoto === idNumerico);
      if (info) {
        imagen.src = info.imagen;
      } else {
        console.error(`No se encontró la imagen con id ${idNumerico}`);
      }
    } else {
      console.error("No se encontró el atributo data-id-imagen");
    }
  }, DURACION_FLIP);
  imagen.addEventListener(
    "animationend",
    () => {
      imagen.classList.remove("flip");
    },
    { once: true }
  );
};

const actualizarImagenCarta = (indice: number, src: string): void => {
  const cartaDiv =
    document.querySelectorAll<HTMLDivElement>(".container > div")[indice];
  const imagen = cartaDiv.querySelector<HTMLImageElement>("img");
  if (imagen) {
    imagen.src = src;
  } else {
    console.error("No se encontró la imagen");
  }
};

const actualizarContador = (nuevoNumero: number): void => {
  const contadorElem = document.getElementById("contador");
  if (contadorElem) contadorElem.textContent = "Intentos: " + nuevoNumero;
  else console.error("No se encontró el elemento con id 'contador'");
};

const jugando = (): boolean =>
  tablero.estadoPartida === "PartidaCompleta" || turnoEnProceso;

const esCartaVolteada = (indice: number): boolean =>
  tablero.cartas[indice].estaVuelta;

const mostrarImagenCarta = (cartaDiv: HTMLDivElement, indice: number): void => {
  (cartaDiv as HTMLImageElement).src = tablero.cartas[indice].imagen;
  mostrarImagen(cartaDiv);
};

const primerVolteo = (indice: number, cartaDiv: HTMLDivElement): void => {
  tablero.indiceCartaVolteadaA = indice;
  tablero.estadoPartida = "UnaCartaLevantada";
  tablero.cartas[indice].estaVuelta = true;
  mostrarImagenCarta(cartaDiv, indice);
};

const actualizarContadorIntentos = (): void => {
  const contadorElement = document.getElementById("contador");
  const intentosActuales = parseInt(
    contadorElement?.textContent?.replace("Intentos: ", "") || "0"
  );
  actualizarContador(intentosActuales + 1);
};

const marcarParejaEncontrada = (indiceA: number, indiceB: number): void => {
  tablero.cartas[indiceA].encontrada = true;
  tablero.cartas[indiceB].encontrada = true;
};

const voltearCartasTrasRetraso = (indiceA: number, indiceB: number): void => {
  setTimeout(() => {
    tablero.cartas[indiceA].estaVuelta = false;
    tablero.cartas[indiceB].estaVuelta = false;
    actualizarImagenCarta(indiceA, "/img/pngint.png");
    actualizarImagenCarta(indiceB, "/img/pngint.png");
    const cartaA = document.getElementById(
      `carta-${indiceA}`
    ) as HTMLImageElement;
    const cartaB = document.getElementById(
      `carta-${indiceB}`
    ) as HTMLImageElement;
    if (cartaA) cartaA.src = "/img/pngint.png";
    if (cartaB) cartaB.src = "/img/pngint.png";
  }, TIEMPO_ESPERA);
};

const reiniciarTurnoTrasRetraso = (): void => {
  setTimeout(() => {
    tablero.indiceCartaVolteadaA = undefined;
    tablero.indiceCartaVolteadaB = undefined;
    turnoEnProceso = false;
    if (!esPartidaCompleta(tablero)) {
      tablero.estadoPartida = "CeroCartasLevantadas";
    } else {
      finalizarPartida();
    }
  }, TIEMPO_ESPERA);
};

const finalizarPartida = (): void => {
  tablero.estadoPartida = "PartidaCompleta";
  const btnReiniciar = document.getElementById("btnReiniciar");
  if (btnReiniciar) {
    (btnReiniciar as HTMLElement).style.display = "inline-block";
  }
  const contadorElement = document.getElementById("contador");
  const intentos = parseInt(
    contadorElement?.textContent?.replace("Intentos: ", "") || "0"
  );
  mostrarMensaje(
    `¡Felicidades! Has completado la partida en ${intentos} intentos!`,
    false
  );
};

const segundoVolteo = (indice: number, cartaDiv: HTMLDivElement): void => {
  turnoEnProceso = true;
  tablero.indiceCartaVolteadaB = indice;
  tablero.estadoPartida = "DosCartasLevantadas";
  tablero.cartas[indice].estaVuelta = true;
  mostrarImagenCarta(cartaDiv, indice);
  actualizarContadorIntentos();

  const indiceA = tablero.indiceCartaVolteadaA!;
  const indiceB = tablero.indiceCartaVolteadaB!;

  if (sonPareja(tablero, indiceA, indiceB)) {
    marcarParejaEncontrada(indiceA, indiceB);
  } else {
    voltearCartasTrasRetraso(indiceA, indiceB);
  }
  reiniciarTurnoTrasRetraso();
};

const cartaClick = (indice: number, cartaDiv: HTMLDivElement): void => {
  if (jugando()) return;

  if (esCartaVolteada(indice)) {
    mostrarMensaje("La carta ya está volteada.", true);
    return;
  }

  if (turnoEnProceso) {
    mostrarMensaje("Espera a que termine el turno actual.", true);
    return;
  }

  switch (tablero.estadoPartida) {
    case "CeroCartasLevantadas":
      primerVolteo(indice, cartaDiv);
      break;

    case "UnaCartaLevantada":
      segundoVolteo(indice, cartaDiv);
      break;

    case "DosCartasLevantadas":
      mostrarMensaje("Ya hay dos cartas levantadas.", true);
      break;

    default:
      break;
  }
};

const mostrarMensaje = (texto: string, autoClear: boolean = true): void => {
  const mensajeElem = document.getElementById("mensaje");
  if (mensajeElem) {
    mensajeElem.textContent = texto;
    if (autoClear) {
      setTimeout(() => {
        mensajeElem.textContent = "";
      }, TIEMPO_ESPERA);
    } else {
      console.error("No se encontró el elemento con id 'mensaje'");
    }
  } else {
    console.error("No se encontró el elemento con id 'mensaje'");
  }
};

const limpiarMensaje = (): void => {
  const mensajeElem = document.getElementById("mensaje");
  if (mensajeElem) mensajeElem.textContent = "";
  else console.error("No se encontró el elemento con id 'mensaje'");
};
