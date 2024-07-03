import { showHUD } from "@raycast/api";
import { LocalStorage } from "@raycast/api";
import { Timer } from "./Timer";
import { runAppleScript } from "@raycast/utils";
import formatDuration from "./utils/formatDuration";

export default async function Command() {
  console.log("Command function called");

  try {
    const timerString = await LocalStorage.getItem<string>("runningTimer");

    if (timerString) {
      const timer = JSON.parse(timerString) as Timer;
      const duration = Date.now() - timer.startTime;
      await runAppleScript(`
        display notification "Timer for ${timer.title} running for ${formatDuration(duration)}" sound name "Frog"
      `);
    }
  } catch (error) {
    console.error("Error in Command function:", error);
    await showHUD("Error checking timer status");
  }

  return null;
}
