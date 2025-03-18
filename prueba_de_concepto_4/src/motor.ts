import { Tablero, tablero } from "./modelo";

export const iniciaPartida = (): void => {
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

  const cartasVolteadas = tablero.cartas.filter(
    (c) => c.estaVuelta && !c.encontrada
  );
  return cartasVolteadas.length < 2;
};

export const voltearLaCarta = (indice: number) =>
  (tablero.cartas[indice].estaVuelta = true);

export const sonPareja = (indiceA: number, indiceB: number): boolean =>
  tablero.cartas[indiceA].idFoto === tablero.cartas[indiceB].idFoto;

export const parejaEncontrada = (indiceA: number, indiceB: number): void => {
  tablero.cartas[indiceA].encontrada = true;
  tablero.cartas[indiceB].encontrada = true;
};
export const parejaNoEncontrada = (
  tablero: Tablero,
  indiceA: number,
  indiceB: number
): void => {
  tablero.cartas[indiceA].estaVuelta = false;
  tablero.cartas[indiceB].estaVuelta = false;
};
