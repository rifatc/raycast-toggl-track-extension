import { useFetch } from "@raycast/utils";
import { getPreferenceValues } from "@raycast/api";

interface Workspace {
  id: number;
  name: string;
}

interface Project {
  id: number;
  name: string;
}

interface Preferences {
  togglTrackApiKey: string;
}

const preferences = getPreferenceValues<Preferences>();
const apiKey = preferences.togglTrackApiKey;

export function useWorkspaces() {
  return useFetch<Workspace[]>("https://api.track.toggl.com/api/v9/workspaces", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${apiKey}:api_token`).toString("base64")}`,
    },
  });
}

export function useProjects(workspaceId: number | null) {
  return useFetch<Project[]>(
    `https://api.track.toggl.com/api/v9/workspaces/${workspaceId}/projects`,
    {
      execute: !!workspaceId,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${apiKey}:api_token`).toString("base64")}`,
      },
    }
  );
}
