type InfoCarta = {
  idFoto: number;
  imagen: string;
};

interface Carta {
  idFoto: number;
  imagen: string;
}

const infoCartas: InfoCarta[] = [
  {
    idFoto: 1,
    imagen: "🐸",
  },
  {
    idFoto: 2,
    imagen: "🐒",
  },
  {
    idFoto: 3,
    imagen: "🐶",
  },
  {
    idFoto: 4,
    imagen: "🐠",
  },
  {
    idFoto: 5,
    imagen: "🦉",
  },
  {
    idFoto: 6,
    imagen: "🐷",
  },
];

const barajarCartas = (cartas: Carta[]): Carta[] => {
  cartas.forEach((_, i, arr) => {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  });
  return cartas;
};

console.log(barajarCartas(infoCartas));
