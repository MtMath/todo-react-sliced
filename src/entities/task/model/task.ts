export type TaskStatus = "PENDING" | "COMPLETED";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  userId: string;
  taskListId: string;
  position: number;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  taskListId?: string;
}

export interface UpdateTaskDto {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  taskListId?: string;
  position?: number;
}
