import { ActionPanel, Action, Form } from "@raycast/api";
import { Timer, projects } from "./Timer";

interface StartTimerFormProps {
  onSubmit: (title: string, project: string) => void;
}

export function StartTimerForm({ onSubmit }: StartTimerFormProps) {
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Start Timer"
            onSubmit={(values) => {
              onSubmit(values.title, values.project);
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" title="Title" placeholder="Enter timer title" />
      <Form.Dropdown id="project" title="Project">
        {projects.map((project) => (
          <Form.Dropdown.Item key={project} value={project} title={project} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}
