import Game from "./Game";
import LaserCannon from "./characters/LaserCannon";
import "./style.css";

async function main() {
  const game = Game(11 * 2, 8 * 2, 10);

  game.add(LaserCannon());
}

main();
