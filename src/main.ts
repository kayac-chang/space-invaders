import Crab from "./Crab";
import Game from "./Game";
import "./style.css";

async function main() {
  const game = Game(11 * 2, 8 * 2, 10);

  const a = Crab();
  game.add(a);

  const b = Crab();
  b.position.x = 11;
  b.position.y = 8;
  game.add(b);
}

main();
