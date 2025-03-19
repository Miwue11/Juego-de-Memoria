import { TIEMPO_ESPERA } from "./constantes";
import { Carta, Tablero } from "./modelo";

const barajarCartas = (cartas: Carta[]): Carta[] => {
  const copia = [...cartas];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
};

const sePuedeVoltearLaCarta = (tablero: Tablero, indice: number): boolean => {
  const carta = tablero.cartas[indice];
  if (carta.encontrada || carta.estaVuelta) return false;
  const cartasVolteadas = tablero.cartas.filter(
    (c) => c.estaVuelta && !c.encontrada
  );
  return cartasVolteadas.length < 2;
};

const voltearLaCarta = (tablero: Tablero, indice: number): void => {
  if (!sePuedeVoltearLaCarta(tablero, indice)) return;
  tablero.cartas[indice].estaVuelta = true;
  if (tablero.indiceCartaVolteadaA === undefined) {
    tablero.indiceCartaVolteadaA = indice;
  } else {
    tablero.indiceCartaVolteadaB = indice;
  }
};

export const sonPareja = (
  tablero: Tablero,
  indiceA: number,
  indiceB: number
): boolean => {
  const esPareja =
    tablero.cartas[indiceA].idFoto === tablero.cartas[indiceB].idFoto;

  if (esPareja) {
    parejaEncontrada(tablero, indiceA, indiceB);
  } else {
    setTimeout(() => {
      parejaNoEncontrada(tablero, indiceA, indiceB);
    }, TIEMPO_ESPERA / 1.5);
  }
  voltearLaCarta(tablero, indiceA);
  voltearLaCarta(tablero, indiceB);
  return esPareja;
};

const parejaEncontrada = (
  tablero: Tablero,
  indiceA: number,
  indiceB: number
): void => {
  tablero.cartas[indiceA].encontrada = true;
  tablero.cartas[indiceB].encontrada = true;
  tablero.estadoPartida = esPartidaCompleta(tablero)
    ? "PartidaCompleta"
    : "UnaCartaLevantada";
  tablero.indiceCartaVolteadaA = undefined;
  tablero.indiceCartaVolteadaB = undefined;
};

const parejaNoEncontrada = (
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

export const esPartidaCompleta = (tablero: Tablero): boolean => {
  return tablero.cartas.every((carta) => carta.encontrada);
};

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
