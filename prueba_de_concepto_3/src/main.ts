const container = document.getElementById("container");
const imagen = document.getElementById("imagen") as HTMLImageElement;
let flipping = false;

container?.addEventListener("click", () => {
  if (flipping) return;
  flipping = true;
  imagen.classList.add("flip");

  setTimeout(() => {
    if (imagen.src.includes("pngint.png")) {
      imagen.src =
        "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/refs/heads/main/memo/1.png";
    } else {
      imagen.src = "/img/pngint.png";
    }
  }, 300);

  imagen.addEventListener(
    "animationend",
    () => {
      imagen.classList.remove("flip");
      flipping = false;
    },
    { once: true }
  );
});
