import { Tablero, infoCartas } from "./modelo";
import { iniciaPartida, sonPareja, esPartidaCompleta } from "./motor";
import { DURACION_FLIP, TIEMPO_ESPERA } from "./constantes";

let turnoEnProceso: boolean = false;

const ocultarBotones = (): void => {
  const btnJugar = document.getElementById("btnJugar");
  const btnReiniciar = document.getElementById("btnReiniciar");
  if (btnJugar) btnJugar.style.display = "none";
  if (btnReiniciar) btnReiniciar.style.display = "none";
};
const eventosJugar = (tablero: Tablero): void => {
  const btnJugar = document.getElementById("btnJugar");
  btnJugar?.addEventListener("click", () => {
    iniciaPartida(tablero);
    actualizarContador(0);
    limpiarMensaje();
    configurarCartas(tablero);
    ocultarBotones();
  });
};
const eventosReiniciar = (tablero: Tablero): void => {
  const btnReiniciar = document.getElementById("btnReiniciar");
  btnReiniciar?.addEventListener("click", () => {
    iniciaPartida(tablero);
    actualizarContador(0);
    limpiarMensaje();
    configurarCartas(tablero);
    turnoEnProceso = false;
    ocultarBotones();
  });
};

export const iniciarInterfaz = (tablero: Tablero): void => {
  eventosJugar(tablero);
  eventosReiniciar(tablero);
  if (!tablero) console.error("Tablero no inicializado");
};

const EventosClick = (
  tablero: Tablero,
  cartaDiv: HTMLDivElement,
  indice: number
) => {
  cartaDiv.onclick = null;
  cartaDiv.onclick = () => cartaClick(tablero, indice, cartaDiv);
};

const quitandoFlipImagen = (
  tablero: Tablero,
  cartaDiv: HTMLDivElement,
  indice: number
) => {
  const imagen = cartaDiv.querySelector<HTMLImageElement>("img");
  if (imagen) {
    imagen.src = "/img/pngint.png";
    imagen.classList.remove("flip");
    imagen.setAttribute(
      "data-id-imagen",
      tablero.cartas[indice].idFoto.toString()
    );
  }
  EventosClick(tablero, cartaDiv, indice);
};

const seleccionDeCartas = (
  tablero: Tablero,
  cartasDiv: NodeListOf<HTMLDivElement>
) => {
  cartasDiv.forEach((cartaDiv, indice) => {
    quitandoFlipImagen(tablero, cartaDiv, indice);
  });
};

const configurarCartas = (tablero: Tablero): void => {
  const cartasDiv =
    document.querySelectorAll<HTMLDivElement>(".container > div");
  seleccionDeCartas(tablero, cartasDiv);
  if (!cartasDiv) console.error("no se encontraron las cartas");
};

const mostrarImagen = (cartaDiv: HTMLDivElement) => {
  const imagen = cartaDiv.querySelector<HTMLImageElement>("img");
  if (!imagen) return;
  else console.error("No se encontró la imagen");
  imagen.classList.add("flip");
  setImagen(imagen);
  imagen.addEventListener(
    "animationend",
    () => {
      imagen.classList.remove("flip");
    },
    { once: true }
  );
};

const setImagen = (imagen: HTMLImageElement) => {
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

const jugando = (tablero: Tablero): boolean =>
  tablero.estadoPartida === "PartidaCompleta" || turnoEnProceso;

const esCartaVolteada = (tablero: Tablero, indice: number): boolean =>
  tablero.cartas[indice].estaVuelta;

const mostrarImagenCarta = (
  tablero: Tablero,
  cartaDiv: HTMLDivElement,
  indice: number
): void => {
  (cartaDiv as HTMLImageElement).src = tablero.cartas[indice].imagen;
  mostrarImagen(cartaDiv);
};

const primerVolteo = (
  tablero: Tablero,
  indice: number,
  cartaDiv: HTMLDivElement
): void => {
  tablero.indiceCartaVolteadaA = indice;
  tablero.estadoPartida = "UnaCartaLevantada";
  tablero.cartas[indice].estaVuelta = true;
  mostrarImagenCarta(tablero, cartaDiv, indice);
};

const actualizarContadorIntentos = (): void => {
  const contadorElement = document.getElementById("contador");
  const intentosActuales = parseInt(
    contadorElement?.textContent?.replace("Intentos: ", "") || "0"
  );
  actualizarContador(intentosActuales + 1);
};

const marcarParejaEncontrada = (
  tablero: Tablero,
  indiceA: number,
  indiceB: number
): void => {
  tablero.cartas[indiceA].encontrada = true;
  tablero.cartas[indiceB].encontrada = true;
};

const voltearCartasTrasRetraso = (
  tablero: Tablero,
  indiceA: number,
  indiceB: number
): void => {
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

const reiniciarTurnoTrasRetraso = (tablero: Tablero): void => {
  setTimeout(() => {
    tablero.indiceCartaVolteadaA = undefined;
    tablero.indiceCartaVolteadaB = undefined;
    turnoEnProceso = false;
    if (!esPartidaCompleta(tablero)) {
      tablero.estadoPartida = "CeroCartasLevantadas";
    } else {
      finalizarPartida(tablero);
    }
  }, TIEMPO_ESPERA);
};

const finalizarPartida = (tablero: Tablero): void => {
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

const segundoVolteo = (
  tablero: Tablero,
  indice: number,
  cartaDiv: HTMLDivElement
): void => {
  turnoEnProceso = true;
  tablero.indiceCartaVolteadaB = indice;
  tablero.estadoPartida = "DosCartasLevantadas";
  tablero.cartas[indice].estaVuelta = true;
  mostrarImagenCarta(tablero, cartaDiv, indice);
  actualizarContadorIntentos();

  const indiceA = tablero.indiceCartaVolteadaA!;
  const indiceB = tablero.indiceCartaVolteadaB!;

  if (sonPareja(tablero, indiceA, indiceB)) {
    marcarParejaEncontrada(tablero, indiceA, indiceB);
  } else {
    voltearCartasTrasRetraso(tablero, indiceA, indiceB);
  }
  reiniciarTurnoTrasRetraso(tablero);
};

const cartaClick = (
  tablero: Tablero,
  indice: number,
  cartaDiv: HTMLDivElement
): void => {
  if (jugando(tablero)) return;

  if (esCartaVolteada(tablero, indice)) {
    mostrarMensaje("La carta ya está volteada.", true);
    return;
  }

  if (turnoEnProceso) {
    mostrarMensaje("Espera a que termine el turno actual.", true);
    return;
  }

  switch (tablero.estadoPartida) {
    case "CeroCartasLevantadas":
      primerVolteo(tablero, indice, cartaDiv);
      break;

    case "UnaCartaLevantada":
      segundoVolteo(tablero, indice, cartaDiv);
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
