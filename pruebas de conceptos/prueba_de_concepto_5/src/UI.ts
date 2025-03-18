import { tablero } from "./modelo";
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

// Variable para evitar clics adicionales durante el turno
let turnoEnProceso = false;

export const iniciarInterfaz = (): void => {
  const btnJugar = document.getElementById("btnJugar");
  const btnReiniciar = document.getElementById("btnReiniciar");

  // Evento para iniciar la partida
  btnJugar?.addEventListener("click", () => {
    iniciaPartida(tablero);
    actualizarContador(0);
    limpiarMensaje();
    configurarCartas();
    turnoEnProceso = false;

    // Oculta el botón "Jugar" y asegura que "Reiniciar" permanezca oculto
    (btnJugar as HTMLElement).style.display = "none";
    (btnReiniciar as HTMLElement).style.display = "none";
  });

  // Evento para reiniciar la partida
  btnReiniciar?.addEventListener("click", () => {
    iniciaPartida(tablero);
    actualizarContador(0);
    limpiarMensaje();
    configurarCartas();
    turnoEnProceso = false;
    (btnReiniciar as HTMLElement).style.display = "none";
  });
};

// Para evitar la acumulación de event listeners, clonamos cada nodo de carta y lo reemplazamos
const configurarCartas = (): void => {
  const cartasDiv =
    document.querySelectorAll<HTMLDivElement>(".container > div");
  cartasDiv.forEach((cartaDiv, indice) => {
    // Clonamos el nodo para eliminar listeners previos
    const nuevoNodo = cartaDiv.cloneNode(true) as HTMLDivElement;
    cartaDiv.parentNode?.replaceChild(nuevoNodo, cartaDiv);
    // Actualizamos la imagen a reverso
    const imagen = nuevoNodo.querySelector<HTMLImageElement>("img");
    if (imagen) {
      imagen.src = "/img/pngint.png";
    }
    // Asocia el listener para el clic usando el índice mediante clausura
    nuevoNodo.addEventListener("click", () => onCartaClic(indice, nuevoNodo));
  });
};

const onCartaClic = (indice: number, cartaDiv: HTMLDivElement): void => {
  // Si la partida ya se completó o se está procesando el turno, no se aceptan más clics
  if (tablero.estadoPartida === "PartidaCompleta" || turnoEnProceso) return;

  // Si la carta ya está volteada, muestra un mensaje de aviso durante 400 ms y termina
  if (tablero.cartas[indice].estaVuelta) {
    mostrarMensaje("La carta ya está volteada.", true);
    return;
  }

  // Si la carta no se puede voltear, no hace nada
  if (!sePuedeVoltearLaCarta(tablero, indice)) return;

  // Marca la carta como volteada en el modelo
  voltearLaCarta(tablero, indice);

  // Obtiene la imagen dentro del div de la carta
  const imagen = cartaDiv.querySelector<HTMLImageElement>("img");
  if (!imagen) return;

  // Aplica la animación de flip añadiendo la clase "flip"
  imagen.classList.add("flip");

  // A la mitad de la animación, cambia el src a la imagen de frente según el modelo
  setTimeout(() => {
    imagen.src = tablero.cartas[indice].imagen;
  }, DURACION_FLIP);

  // Al finalizar la animación, remueve la clase "flip"
  imagen.addEventListener(
    "animationend",
    () => {
      imagen.classList.remove("flip");
    },
    { once: true }
  );

  // Control del turno mediante switch
  switch (tablero.estadoPartida) {
    case "CeroCartasLevantadas":
      tablero.indiceCartaVolteadaA = indice;
      tablero.estadoPartida = "UnaCartaLevantada";
      break;

    case "UnaCartaLevantada":
      turnoEnProceso = true;
      tablero.indiceCartaVolteadaB = indice;
      tablero.estadoPartida = "DosCartasLevantadas";

      // Actualiza el contador de intentos al voltear la segunda carta
      actualizarContador(
        parseInt(
          document
            .getElementById("contador")
            ?.textContent?.replace("Intentos: ", "") || "0"
        ) + 1
      );

      const indiceA = tablero.indiceCartaVolteadaA!;
      const indiceB = tablero.indiceCartaVolteadaB!;

      if (sonPareja(indiceA, indiceB, tablero)) {
        // Si son pareja, se marcan como encontradas
        parejaEncontrada(tablero, indiceA, indiceB);
      } else {
        // Si no son pareja, espera TIEMPO_ESPERA y las vuelve a poner boca abajo
        setTimeout(() => {
          parejaNoEncontrada(tablero, indiceA, indiceB);
          actualizarImagenCarta(indiceA, "/img/pngint.png");
          actualizarImagenCarta(indiceB, "/img/pngint.png");
        }, TIEMPO_ESPERA);
      }

      // Reinicia los índices del turno y actualiza el estado después de TIEMPO_ESPERA
      setTimeout(() => {
        tablero.indiceCartaVolteadaA = undefined;
        tablero.indiceCartaVolteadaB = undefined;
        if (!esPartidaCompleta(tablero)) {
          tablero.estadoPartida = "CeroCartasLevantadas";
        }
        turnoEnProceso = false;

        // Si la partida está completa, muestra el botón "Reiniciar" y un mensaje persistente
        if (esPartidaCompleta(tablero)) {
          tablero.estadoPartida = "PartidaCompleta";
          const btnReiniciar = document.getElementById("btnReiniciar");
          (btnReiniciar as HTMLElement).style.display = "inline-block";
          mostrarMensaje("¡Felicitaciones! Has completado la partida.", false);
        }
      }, TIEMPO_ESPERA);
      break;

    default:
      break;
  }
};

const actualizarImagenCarta = (indice: number, src: string): void => {
  const cartasDiv =
    document.querySelectorAll<HTMLDivElement>(".container > div");
  const cartaDiv = cartasDiv[indice];
  const imagen = cartaDiv.querySelector<HTMLImageElement>("img");
  if (imagen) {
    imagen.src = src;
  }
};

const actualizarContador = (nuevosIntentos: number): void => {
  const contador = document.getElementById("contador");
  if (contador) contador.textContent = "Intentos: " + nuevosIntentos;
};

// Función para mostrar un mensaje; si autoClear es true, se borra en 400 ms; si es false, permanece
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

const limpiarMensaje = (): void => {
  const mensaje = document.getElementById("mensaje");
  if (mensaje) mensaje.textContent = "";
};
