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
    console.log("Timer started:", newTimer);
    closeMainWindow({popToRootType: PopToRootType.Immediate});
  };

  const stopTimer = () => {
    LocalStorage.removeItem("runningTimer");
    setRunningTimer(null);
    console.log("Timer stopped");
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
