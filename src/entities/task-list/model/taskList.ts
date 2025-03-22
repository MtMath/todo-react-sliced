export interface TaskList {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isDefault: boolean;
  position: number;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateTaskListDto {
  name: string;
  description?: string;
  color?: string;
  isDefault?: boolean;
}

export interface UpdateTaskListDto {
  id: string;
  name?: string;
  description?: string;
  color?: string;
  isDefault?: boolean;
  position?: number;
}
