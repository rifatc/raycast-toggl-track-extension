import { getPreferenceValues } from "@raycast/api";
import fetch from "node-fetch";
import { PastTimerFormValues } from "../PastTimerForm";

interface Preferences {
  togglTrackApiKey: string;
}

interface TogglResponse {
  id: number;
}

interface Timer {
  title: string;
  startTime: number;
  workspaceId: number;
  projectId?: number;
}

interface StopTimerResponse {
  id: number;
  stop: string;
}

const TOGGL_API_BASE_URL = 'https://api.track.toggl.com/api/v9';

/**
 * Creates a timer in Toggl Track.
 * @param timer The timer object containing details for the timer to be created.
 * @returns The ID of the created timer.
 * @throws Will throw an error if the timer creation fails.
 */
export async function createTogglTimer(timer: Timer): Promise<number> {
  const { togglTrackApiKey } = getPreferenceValues<Preferences>();
  const { title, startTime, workspaceId, projectId } = timer;

  const url = `${TOGGL_API_BASE_URL}/workspaces/${workspaceId}/time_entries`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${Buffer.from(`${togglTrackApiKey}:api_token`).toString('base64')}`,
  };
  const body = JSON.stringify({
    description: title,
    start: new Date(startTime).toISOString(),
    duration: -1,
    created_with: "Raycast",
    project_id: projectId ?? undefined,
    wid: workspaceId,
    billable: false,
    tags: [],
  });

  try {
    const response = await fetch(url, { method: 'POST', headers, body });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json() as TogglResponse;
    return data.id;
  } catch (error) {
    console.error('Error creating timer:', error);
    throw error;
  }
}

export async function createPastTimer(timer: PastTimerFormValues): Promise<number> {
  const { togglTrackApiKey } = getPreferenceValues<Preferences>();
  const { title, duration, workspaceId, projectId } = timer;
  const durationInSec = Number(duration) * 60;

  const url = `${TOGGL_API_BASE_URL}/workspaces/${workspaceId}/time_entries`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${Buffer.from(`${togglTrackApiKey}:api_token`).toString('base64')}`,
  };

  const body = JSON.stringify({
    description: title,
    start: new Date(Date.now() - durationInSec * 1000).toISOString(),
    duration: Number(durationInSec),
    created_with: "Raycast",
    project_id: Number(projectId) ?? undefined,
    wid: Number(workspaceId),
    billable: false,
    tags: [],
  });

  try {
    const response = await fetch(url, { method: 'POST', headers, body });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json() as { id: number };
    return data.id;
  } catch (error) {
    console.error('Error creating past timer:', error);
    throw error;
  }
}

/**
 * Stops a running timer in Toggl Track.
 * @param workspaceId The workspace ID as a string.
 * @param timerId The ID of the timer to stop.
 * @returns The response from Toggl API with the stopped timer details.
 * @throws Will throw an error if stopping the timer fails.
 */
export async function stopTogglTimer(workspaceId: string, timerId: number): Promise<StopTimerResponse> {
  const { togglTrackApiKey } = getPreferenceValues<Preferences>();

  const url = `${TOGGL_API_BASE_URL}/workspaces/${workspaceId}/time_entries/${timerId}/stop`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${Buffer.from(`${togglTrackApiKey}:api_token`).toString('base64')}`,
  };

  try {
    const response = await fetch(url, { method: 'PATCH', headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json() as StopTimerResponse;
    return data;
  } catch (error) {
    console.error('Error stopping timer:', error);
    throw error;
  }
}
