import { Action, ActionPanel, closeMainWindow, Icon, List, LocalStorage, PopToRootType } from "@raycast/api";
import { useEffect, useState } from "react";
import { Timer } from "./Timer";
import { StartTimerForm } from "./StartTimerForm";

export default function Command() {
  const [runningTimer, setRunningTimer] = useState<Timer | null>(null);

  useEffect(() => {
    LocalStorage.getItem("runningTimer").then((timerString) => {
      if (timerString) {
        if (typeof timerString === "string") {
          const timer: Timer = JSON.parse(timerString);
          setRunningTimer(timer);
        }
      }
    });
  }, []);

  const startTimer = (title: string, workspaceId: number) => {
    const newTimer: Timer = { title, workspaceId, startTime: Date.now() };
    LocalStorage.setItem("runningTimer", JSON.stringify(newTimer));
    setRunningTimer(newTimer);
    closeMainWindow({popToRootType: PopToRootType.Immediate});
  };

  const stopTimer = async () => {
    const currentTimer = await LocalStorage.getItem("runningTimer");
    if (typeof currentTimer === "string") {
      const timer: Timer = JSON.parse(currentTimer);
      timer.endTime = Date.now();
      LocalStorage.setItem("lastTimer", JSON.stringify(timer));
    }
    LocalStorage.removeItem("runningTimer");
    setRunningTimer(null);
    closeMainWindow({popToRootType: PopToRootType.Immediate});
  };

  return (
    <List>
      <List.Item
        title={runningTimer ? "Stop Timer" : "Start Timer"}
        icon={runningTimer ? Icon.Stop : Icon.Stopwatch}
        actions={
          <ActionPanel>
            {runningTimer ? (
              <Action title="Stop Timer" onAction={stopTimer} />
            ) : (
              <Action.Push
                title="Start Timer"
                target={<StartTimerForm onSubmit={startTimer} />}
              />
            )}
          </ActionPanel>
        }
      />
    </List>
  );
}
