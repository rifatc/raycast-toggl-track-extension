export interface Timer {
  id?: number;
  title: string;
  workspaceId: number;
  projectId?: number;
  startTime: number;
  endTime?: number;
}
