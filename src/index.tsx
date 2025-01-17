import {
  Action,
  ActionPanel,
  closeMainWindow,
  Icon,
  List,
  LocalStorage,
  PopToRootType,
  showToast,
  Toast
} from "@raycast/api";
import { useEffect, useState } from "react";
import { useCachedState } from "@raycast/utils";
import { Timer } from "./Timer";
import { StartTimerForm } from "./StartTimerForm";
import { createTogglTimer, stopTogglTimer } from "./api/togglTrackApi";
import formatDuration from "./utils/formatDuration";
import CreatePastTimer from "./PastTimerForm";

export default function Command() {
  const [runningTimer, setRunningTimer] = useCachedState<Timer | null>("runningTimer", null);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState<string>("");

  useEffect(() => {
    setIsLoading(false);

    let intervalId: NodeJS.Timeout;

    if (runningTimer) {
      const updateDuration = () => {
        const elapsed = Date.now() - runningTimer.startTime;
        setDuration(formatDuration(elapsed));
      };

      updateDuration(); // Initial update
      intervalId = setInterval(updateDuration, 1000); // Update every second
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [runningTimer]);

  const startTimer = async (title: string, workspaceId: number, projectId: number) => {
    const newTimer: Timer = { title, workspaceId, projectId, startTime: Date.now() };
    try {
      newTimer.id = await createTogglTimer(newTimer);
      setRunningTimer(newTimer);
      await LocalStorage.setItem("runningTimer", JSON.stringify(newTimer));
      await showToast({ style: Toast.Style.Success, title: "Timer started", message: title });
      await closeMainWindow({ popToRootType: PopToRootType.Immediate });
    } catch (error) {
      console.error("Failed to start timer:", error);
      await showToast({ style: Toast.Style.Failure, title: "Failed to start timer", message: "Please try again" });
    }
  };

  const stopTimer = async () => {
    if (runningTimer) {
      const stoppedTimer = { ...runningTimer, endTime: Date.now() };
      try {
        await stopTogglTimer(stoppedTimer.workspaceId.toString(), stoppedTimer.id!);
        await LocalStorage.setItem("lastTimer", JSON.stringify(stoppedTimer));
        await LocalStorage.removeItem("runningTimer");
        setRunningTimer(null);
        await showToast({ style: Toast.Style.Success, title: "Timer stopped", message: runningTimer.title });
        await closeMainWindow({ popToRootType: PopToRootType.Immediate });
      } catch (error) {
        console.error("Failed to stop timer:", error);
        await showToast({ style: Toast.Style.Failure, title: "Failed to stop timer", message: "Please try again" });
      }
    }
  };

  return (
    <List isLoading={isLoading}>
      <List.Item
        title={runningTimer ? `Stop Timer: ${runningTimer.title}` : "Start Timer"}
        icon={runningTimer ? Icon.Stop : Icon.Stopwatch}
        accessories={runningTimer ? [{ text: duration }] : []}
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
      <List.Item
        title="Create a Past Timer"
        icon={Icon.Stopwatch}
        actions={
          <ActionPanel>
            <Action.Push
              title="Create Past Timer"
              target={<CreatePastTimer />}
            />
          </ActionPanel>
        }
      />
      <List.Item
        title="Open Toggl Track in Browser"
        icon={Icon.Globe}
        actions={
          <ActionPanel>
            <Action.OpenInBrowser url="https://track.toggl.com/timer" />
          </ActionPanel>
        }
      />
    </List>
  );
}
