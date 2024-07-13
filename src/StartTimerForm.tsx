// StartTimerForm.tsx

import { ActionPanel, Action, Form, LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";
import { useWorkspaces, useProjects } from "./hooks/api";

interface StartTimerFormProps {
  onSubmit: (title: string, workspaceId: number, projectId: number) => void;
}

interface LastTimer {
  title: string;
  workspaceId: number;
  projectId: number;
}

export function StartTimerForm({ onSubmit }: StartTimerFormProps) {
  const [lastTimer, setLastTimer] = useState<LastTimer | null>(null);
  const [isLoadingLastTimer, setIsLoadingLastTimer] = useState(true);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);

  const { data: workspaces, isLoading: isLoadingWorkspaces } = useWorkspaces();
  const { data: projects } = useProjects(selectedWorkspaceId);

  useEffect(() => {
    async function fetchLastTimer() {
      setIsLoadingLastTimer(true);
      const storedLastTimer = await LocalStorage.getItem("lastTimer");
      if (storedLastTimer) {
        setLastTimer(JSON.parse(storedLastTimer as string));
      }
      setIsLoadingLastTimer(false);
    }
    fetchLastTimer();
  }, []);

  if (isLoadingLastTimer || isLoadingWorkspaces) {
    return null;
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Start Timer"
            onSubmit={(values: { title: string; workspace: string; project: string }) => {
              onSubmit(values.title, parseInt(values.workspace), parseInt(values.project));
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Title" defaultValue={lastTimer?.title} />
      <Form.Dropdown
        id="workspace"
        title="Workspace"
        defaultValue={lastTimer?.workspaceId?.toString()}
        onChange={(newValue) => setSelectedWorkspaceId(parseInt(newValue))}
      >
        {workspaces?.map((workspace) => (
          <Form.Dropdown.Item key={workspace.id} value={workspace.id.toString()} title={workspace.name} />
        ))}
      </Form.Dropdown>
      <Form.Dropdown
        id="project"
        title="Project"
        defaultValue={lastTimer?.projectId?.toString()}
      >
        {projects?.map((project) => (
          <Form.Dropdown.Item key={project.id} value={project.id.toString()} title={project.name} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}
