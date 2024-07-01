export interface Timer {
  id?: number;
  title: string;
  workspaceId: number;
  startTime: number;
  endTime?: number;
}
