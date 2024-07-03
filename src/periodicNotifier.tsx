import { showHUD } from "@raycast/api";
import { LocalStorage } from "@raycast/api";
import { Timer } from "./Timer";

export default async function Command() {
  console.log("Command function called");

  try {
    const timerString = await LocalStorage.getItem<string>("runningTimer");

    if (timerString) {
      const timer = JSON.parse(timerString) as Timer;
      const duration = Date.now() - timer.startTime;
      await showHUD(`Timer running: ${formatDuration(duration)}`);
    }
  } catch (error) {
    console.error("Error in Command function:", error);
    await showHUD("Error checking timer status");
  }

  return null;
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}
