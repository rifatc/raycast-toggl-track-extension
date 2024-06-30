export interface Timer {
  id?: number;
  title: string;
  project: string;
  startTime: number;
  endTime?: number;
}

export const projects = ["Project A", "Project B", "Project C"];
