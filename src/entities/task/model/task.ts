export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "completed";
  createdAt: Date;
  taskListId: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  taskListId: string;
}

export interface UpdateTaskDto {
  id: string;
  title?: string;
  description?: string;
  status?: "pending" | "completed";
  taskListId?: string;
}
