import Octopus from "./characters/Octopus";
import Game from "./Game";
import "./style.css";

async function main() {
  const game = Game(11 * 2, 8 * 2, 10);

  game.add(Octopus());
}

main();
