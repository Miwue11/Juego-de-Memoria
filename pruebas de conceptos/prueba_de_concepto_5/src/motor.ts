import { Carta, Tablero } from "./modelo";

export const barajarCartas = (cartas: Carta[]): Carta[] => {
  const copia = [...cartas];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
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

export const voltearLaCarta = (tablero: Tablero, indice: number) =>
  (tablero.cartas[indice].estaVuelta = true);

export const sonPareja = (
  indiceA: number,
  indiceB: number,
  tablero: Tablero
): boolean => tablero.cartas[indiceA].idFoto === tablero.cartas[indiceB].idFoto;

export const parejaEncontrada = (
  tablero: Tablero,
  indiceA: number,
  indiceB: number
): void => {
  tablero.cartas[indiceA].encontrada = true;
  tablero.cartas[indiceB].encontrada = true;
  tablero.estadoPartida = esPartidaCompleta(tablero)
    ? "PartidaCompleta"
    : "CeroCartasLevantadas";
  tablero.indiceCartaVolteadaA = undefined;
  tablero.indiceCartaVolteadaB = undefined;
};

export const parejaNoEncontrada = (
  tablero: Tablero,
  indiceA: number,
  indiceB: number
): void => {
  tablero.cartas[indiceA].estaVuelta = false;
  tablero.cartas[indiceB].estaVuelta = false;
  tablero.estadoPartida = "CeroCartasLevantadas";
  tablero.indiceCartaVolteadaA = undefined;
  tablero.indiceCartaVolteadaB = undefined;
};

export const esPartidaCompleta = (tablero: Tablero): boolean =>
  tablero.cartas.every((carta) => carta.encontrada);

export const iniciaPartida = (tablero: Tablero): void => {
  tablero.cartas = barajarCartas(tablero.cartas).map((carta) => ({
    ...carta,
    estaVuelta: false,
    encontrada: false,
  }));
  tablero.estadoPartida = "CeroCartasLevantadas";
  tablero.indiceCartaVolteadaA = undefined;
  tablero.indiceCartaVolteadaB = undefined;
};
