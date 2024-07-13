import React, { useState } from "react";
import {
  Action,
  ActionPanel, closeMainWindow,
  Form, PopToRootType,
  showToast,
  Toast,
} from "@raycast/api";
import { useWorkspaces, useProjects } from "./hooks/api";
import { createPastTimer } from "./api/togglTrackApi";

export interface PastTimerFormValues {
  workspaceId: string;
  projectId: string;
  title: string;
  duration: string;
}

export default function CreatePastTimer() {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const { data: workspaces } = useWorkspaces();
  const { data: projects } = useProjects(workspaceId ? parseInt(workspaceId) : null);

  async function handleSubmit(values: PastTimerFormValues) {
    try {
      await createPastTimer(values);
      await showToast({ style: Toast.Style.Success, title: "Past timer created successfully" });
      await closeMainWindow({ popToRootType: PopToRootType.Immediate });
    } catch (error) {
      await showToast({ style: Toast.Style.Failure, title: "Failed to create past timer", message: String(error) });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="workspaceId" title="Workspace" onChange={setWorkspaceId}>
        {workspaces?.map((workspace) => (
          <Form.Dropdown.Item key={workspace.id} value={String(workspace.id)} title={workspace.name} />
        ))}
      </Form.Dropdown>
      <Form.Dropdown id="projectId" title="Project">
        {projects?.map((project) => (
          <Form.Dropdown.Item key={project.id} value={String(project.id)} title={project.name} />
        ))}
      </Form.Dropdown>
      <Form.TextField id="title" title="Title" placeholder="Enter timer title" />
      <Form.TextField
        id="duration"
        title="Duration (minutes)"
        placeholder="Enter duration in minutes"
      />
    </Form>
  );
}
