export interface Carta {
  idFoto: number; // Identificador del 1 al 6 para 12 cartas, así sabemos rápidamente a qué imagen corresponde (ej. gatito, perrito, etc.)
  imagen: string; // URL de la imagen de frente
  estaVuelta: boolean; // Indica si la carta está volteada (mostrando su frente)
  encontrada: boolean; // Indica si ya se encontró su pareja
}

interface InfoCarta {
  idFoto: number;
  imagen: string;
}

// Información de 6 cartas (asegúrate de tener las imágenes en la ruta indicada)
const infoCartas: InfoCarta[] = [
  {
    idFoto: 1,
    imagen:
      "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/refs/heads/main/memo/1.png",
  },
  {
    idFoto: 2,
    imagen:
      "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/refs/heads/main/memo/2.png",
  },
  {
    idFoto: 3,
    imagen:
      "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/refs/heads/main/memo/3.png",
  },
  {
    idFoto: 4,
    imagen:
      "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/refs/heads/main/memo/4.png",
  },
  {
    idFoto: 5,
    imagen:
      "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/refs/heads/main/memo/5.png",
  },
  {
    idFoto: 6,
    imagen:
      "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/refs/heads/main/memo/6.png",
  },
];

const crearCartaInicial = (idFoto: number, imagen: string): Carta => ({
  idFoto,
  imagen,
  estaVuelta: false,
  encontrada: false,
});

const crearColeccionDeCartasInicial = (infoCartas: InfoCarta[]): Carta[] => {
  let cartas: Carta[] = [];
  // Se duplican las cartas para formar pares
  infoCartas.forEach((info) => {
    cartas.push(crearCartaInicial(info.idFoto, info.imagen));
    cartas.push(crearCartaInicial(info.idFoto, info.imagen));
  });
  // Se barajan las cartas con el algoritmo Fisher–Yates
  for (let i = cartas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cartas[i], cartas[j]] = [cartas[j], cartas[i]];
  }
  return cartas;
};

export let cartas: Carta[] = crearColeccionDeCartasInicial(infoCartas);

export type EstadoPartida =
  | "PartidaNoIniciada"
  | "CeroCartasLevantadas"
  | "UnaCartaLevantada"
  | "DosCartasLevantadas"
  | "PartidaCompleta";

export interface Tablero {
  cartas: Carta[];
  estadoPartida: EstadoPartida; // <-- debe ser este tipo
  indiceCartaVolteadaA?: number;
  indiceCartaVolteadaB?: number;
}

const crearTableroInicial = (): Tablero => ({
  cartas: cartas,
  estadoPartida: "PartidaNoIniciada",
});

export let tablero: Tablero = crearTableroInicial();
