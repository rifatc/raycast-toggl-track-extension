import { ActionPanel, Action, Form, LocalStorage } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { getPreferenceValues } from "@raycast/api";
import { useEffect, useState } from "react";

interface Workspace {
  id: number;
  name: string;
}

interface Preferences {
  togglTrackApiKey: string;
}

interface StartTimerFormProps {
  onSubmit: (title: string, workspaceId: number) => void;
}

interface LastTimer {
  title: string;
  workspaceId: number;
}

export function StartTimerForm({ onSubmit }: StartTimerFormProps) {
  const preferences = getPreferenceValues<Preferences>();
  const apiKey = preferences.togglTrackApiKey;

  const [lastTimer, setLastTimer] = useState<LastTimer | null>(null);
  const [isLoadingLastTimer, setIsLoadingLastTimer] = useState(true);

  const { data, isLoading } = useFetch<Workspace[]>("https://api.track.toggl.com/api/v9/workspaces", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${apiKey}:api_token`).toString("base64")}`
    }
  });

  useEffect(() => {
    async function fetchLastTimer() {
      setIsLoadingLastTimer(true);
      const storedLastTimer = await LocalStorage.getItem<string>("lastTimer");
      if (storedLastTimer) {
        setLastTimer(JSON.parse(storedLastTimer));
      }
      setIsLoadingLastTimer(false);
    }
    fetchLastTimer();
  }, []);

  if (isLoadingLastTimer || isLoading) {
    return <Form isLoading={true} />;
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Start Timer"
            onSubmit={(values) => {
              onSubmit(values.title, parseInt(values.workspace));
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="title"
        title="Title"
        placeholder="Enter timer title"
        defaultValue={lastTimer?.title || ""}
      />
      <Form.Dropdown
        id="workspace"
        title="Workspace"
        defaultValue={lastTimer?.workspaceId?.toString() || ""}
      >
        {data?.map((workspace) => (
          <Form.Dropdown.Item key={workspace.id} value={workspace.id.toString()} title={workspace.name} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}
