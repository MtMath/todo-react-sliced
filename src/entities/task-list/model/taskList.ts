export interface TaskList {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  userId: string;
}

export interface CreateTaskListDto {
  title: string;
  description?: string;
}

export interface UpdateTaskListDto {
  id: string;
  title?: string;
  description?: string;
}
