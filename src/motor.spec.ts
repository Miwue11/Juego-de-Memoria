import * as modelo from "./modelo";

import { sonPareja, esPartidaCompleta, iniciaPartida } from "./motor";

describe("sonPareja", () => {
  it("debería ser true si las cartas son pareja", () => {
    const tablero: modelo.Tablero = {
      cartas: [
        { idFoto: 1, estaVuelta: false, encontrada: false, imagen: "" },
        {
          idFoto: 1,
          estaVuelta: false,
          encontrada: false,
          imagen: "",
        },
      ],
      indiceCartaVolteadaA: undefined,
      indiceCartaVolteadaB: undefined,
      estadoPartida: "CeroCartasLevantadas",
    };
    expect(sonPareja(tablero, 0, 1)).toBe(true);
  });

  it("debería ser false si las cartas no son pareja", () => {
    const tablero: modelo.Tablero = {
      cartas: [
        { idFoto: 1, estaVuelta: false, encontrada: false, imagen: "" },
        {
          idFoto: 2,
          estaVuelta: false,
          encontrada: false,
          imagen: "",
        },
      ],

      indiceCartaVolteadaA: undefined,
      indiceCartaVolteadaB: undefined,
      estadoPartida: "CeroCartasLevantadas",
    };
    expect(sonPareja(tablero, 0, 1)).toBe(false);
  });
});

describe("esPartidaCompleta", () => {
  it("debería ser true si todas las cartas están encontradas", () => {
    const tablero: modelo.Tablero = {
      cartas: [
        { idFoto: 1, estaVuelta: false, encontrada: true, imagen: "" },
        {
          idFoto: 1,
          estaVuelta: false,
          encontrada: true,
          imagen: "",
        },
      ],
      indiceCartaVolteadaA: undefined,
      indiceCartaVolteadaB: undefined,
      estadoPartida: "CeroCartasLevantadas",
    };
    expect(esPartidaCompleta(tablero)).toBe(true);
  });
});

it("debería ser false si no todas las cartas están encontradas", () => {
  const tablero: modelo.Tablero = {
    cartas: [
      { idFoto: 1, estaVuelta: false, encontrada: true, imagen: "" },
      {
        idFoto: 2,
        estaVuelta: false,
        encontrada: false,
        imagen: "",
      },
    ],
    indiceCartaVolteadaA: undefined,
    indiceCartaVolteadaB: undefined,
    estadoPartida: "CeroCartasLevantadas",
  };
  expect(esPartidaCompleta(tablero)).toBe(false);
});

describe("iniciaPartida", () => {
  it("debería iniciar la partida", () => {
    const tablero: modelo.Tablero = {
      cartas: [
        { idFoto: 1, estaVuelta: false, encontrada: false, imagen: "" },
        {
          idFoto: 1,
          estaVuelta: false,
          encontrada: false,
          imagen: "",
        },
      ],
      indiceCartaVolteadaA: undefined,
      indiceCartaVolteadaB: undefined,
      estadoPartida: "CeroCartasLevantadas",
    };
    iniciaPartida(tablero);
    expect(tablero.estadoPartida).toBe("CeroCartasLevantadas");
    expect(tablero.indiceCartaVolteadaA).toBe(undefined);
    expect(tablero.indiceCartaVolteadaB).toBe(undefined);
    tablero.cartas.forEach((carta) => {
      expect(carta.estaVuelta).toBe(false);
    });
  });
});

// describe("barajarCartas", () => {
//   it("debería barajar las cartas", () => {
//     const cartas: modelo.Carta[] = [
//       { idFoto: 1, estaVuelta: false, encontrada: false, imagen: "" },
//       {
//         idFoto: 2,
//         estaVuelta: false,
//         encontrada: false,
//         imagen: "",
//       },
//       { idFoto: 3, estaVuelta: false, encontrada: false, imagen: "" },
//       {
//         idFoto: 4,
//         estaVuelta: false,
//         encontrada: false,
//         imagen: "",
//       },
//     ];
//     const cartasBarajadas = barajarCartas(cartas);
//     expect(cartasBarajadas).not.toEqual(cartas);
//   });
// });

// describe("parejaEncontrada", () => {
//   it("debería marcar las cartas como encontradas", () => {
//     const tablero: modelo.Tablero = {
//       cartas: [
//         { idFoto: 1, estaVuelta: false, encontrada: false, imagen: "" },
//         {
//           idFoto: 1,
//           estaVuelta: false,
//           encontrada: false,
//           imagen: "",
//         },
//       ],
//       indiceCartaVolteadaA: 0,
//       indiceCartaVolteadaB: 1,
//       estadoPartida: "CeroCartasLevantadas",
//     };
//     parejaEncontrada(tablero, 0, 1);
//     expect(tablero.cartas[0].encontrada).toBe(true);
//     expect(tablero.cartas[1].encontrada).toBe(true);
//   });
// });

// describe("parejaNoEncontrada", () => {
//   it("debería voltear las cartas", () => {
//     const tablero: modelo.Tablero = {
//       cartas: [
//         { idFoto: 1, estaVuelta: false, encontrada: false, imagen: "" },
//         { idFoto: 2, estaVuelta: false, encontrada: false, imagen: "" },
//       ],
//       indiceCartaVolteadaA: 0,
//       indiceCartaVolteadaB: 1,
//       estadoPartida: "CeroCartasLevantadas",
//     };
//     parejaNoEncontrada(tablero, 0, 1);
//     expect(tablero.cartas[0].estaVuelta).toBe(false);
//     expect(tablero.cartas[1].estaVuelta).toBe(false);
//   });
// });

// describe("sePuedeVoltearLaCarta", () => {
//   it("debería ser true si la carta no está volteada y no está encontrada", () => {
//     const tablero: modelo.Tablero = {
//       cartas: [{ idFoto: 1, estaVuelta: false, encontrada: false, imagen: "" }],
//       indiceCartaVolteadaA: undefined,
//       indiceCartaVolteadaB: undefined,
//       estadoPartida: "CeroCartasLevantadas",
//     };
//     expect(sePuedeVoltearLaCarta(tablero, 0)).toBe(true);
//   });
// });

// describe("voltearLaCarta", () => {
//   it("debería voltear la carta", () => {
//     const tablero: modelo.Tablero = {
//       cartas: [{ idFoto: 1, estaVuelta: false, encontrada: false, imagen: "" }],
//       indiceCartaVolteadaA: undefined,
//       indiceCartaVolteadaB: undefined,
//       estadoPartida: "CeroCartasLevantadas",
//     };
//     voltearLaCarta(tablero, 0);
//     expect(tablero.cartas[0].estaVuelta).toBe(true);
//   });
// });
