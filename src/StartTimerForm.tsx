import { ActionPanel, Action, Form } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { getPreferenceValues } from "@raycast/api";

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

export function StartTimerForm({ onSubmit }: StartTimerFormProps) {
  const preferences = getPreferenceValues<Preferences>();
  const apiKey = preferences.togglTrackApiKey;

  const { data, isLoading } = useFetch<Workspace[]>("https://api.track.toggl.com/api/v9/workspaces", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${apiKey}:api_token`).toString("base64")}`
    }
  });

  return (
    <Form
      isLoading={isLoading}
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
      <Form.TextField id="title" title="Title" placeholder="Enter timer title" />
      <Form.Dropdown id="workspace" title="Workspace">
        {data?.map((workspace) => (
          <Form.Dropdown.Item key={workspace.id} value={workspace.id.toString()} title={workspace.name} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}
