import { Tablero } from "./modelo";

// Reinicia cada carta (pone ambas boca abajo) y el estado del tablero.
export const iniciaPartida = (tablero: Tablero): void => {
  tablero.cartas.forEach((carta) => {
    carta.estaVuelta = false;
    carta.encontrada = false;
  });
  tablero.estadoPartida = "CeroCartasLevantadas";
  tablero.indiceCartaVolteadaA = undefined;
  tablero.indiceCartaVolteadaB = undefined;
};

export const sePuedeVoltearLaCarta = (
  tablero: Tablero,
  indice: number
): boolean => {
  const carta = tablero.cartas[indice];
  if (carta.encontrada || carta.estaVuelta) return false;
  // Se permite voltear hasta dos cartas a la vez.
  const cartasVolteadas = tablero.cartas.filter(
    (c) => c.estaVuelta && !c.encontrada
  );
  return cartasVolteadas.length < 2;
};

export const voltearLaCarta = (tablero: Tablero, indice: number) =>
  (tablero.cartas[indice].estaVuelta = true);

export const sonPareja = (
  indiceA: number,
  indiceB: number,
  tablero: Tablero
): boolean => tablero.cartas[indiceA].idFoto === tablero.cartas[indiceB].idFoto;

// Como las dos cartas siempre son distintas, esta función se usa para revertir el estado.
export const parejaNoEncontrada = (
  tablero: Tablero,
  indiceA: number,
  indiceB: number
): void => {
  tablero.cartas[indiceA].estaVuelta = false;
  tablero.cartas[indiceB].estaVuelta = false;
};
