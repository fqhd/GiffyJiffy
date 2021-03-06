import { gimme } from "./gimme.js";
import { stop } from "./stop.js";
import { asciify } from "./asciify.js";
import { update_leaderboard } from "./leaderboard.js";
import { lore } from "./lore.js";
import openAICommands from "./openAICommands.js";

export const commands_map = {
  gimme,
  stop,
  asciify,
  update_leaderboard,
  lore,
  ...openAICommands
};
