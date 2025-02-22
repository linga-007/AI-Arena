export interface Problem {
  id: number;
  title: string;
  description: string;
  dataset_link : string;
}

export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  problemId: string | null;
  teamName: string;
  startTime: number;
}

export interface TeamData {
  teamName: string;
  problemId: number;
  timeLeft: number;
  startTime: number;
  isStarted: boolean;
}