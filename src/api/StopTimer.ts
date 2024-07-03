import { getPreferenceValues } from "@raycast/api";
import fetch from "node-fetch";

interface Preferences {
  togglTrackApiKey: string;
}

interface StopTimerResponse {
  id: number;
  stop: string;
}

const TOGGL_API_BASE_URL = 'https://api.track.toggl.com/api/v9';

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
