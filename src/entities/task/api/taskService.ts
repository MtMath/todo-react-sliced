import { apiClient } from "shared/api/api-client";
import { Task, CreateTaskDto, UpdateTaskDto } from "../model/task";

export class TaskService {
  private readonly BASE_URL = "/tasks";

  async getTasks(taskListId?: string): Promise<Task[]> {
    const url = taskListId
      ? `${this.BASE_URL}?taskListId=${taskListId}`
      : this.BASE_URL;

    try {
      const response = await apiClient.get<Task[]>(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async getTaskById(id: string): Promise<Task> {
    try {
      const response = await apiClient.get<Task>(`${this.BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with id ${id}:`, error);
      throw error;
    }
  }

  async createTask(taskData: CreateTaskDto): Promise<Task> {
    try {
      const response = await apiClient.post<Task>(this.BASE_URL, taskData);
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async updateTask(taskData: UpdateTaskDto): Promise<Task> {
    try {
      const { id, ...updateData } = taskData;
      const response = await apiClient.patch<Task>(
        `${this.BASE_URL}/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating task with id ${taskData.id}:`, error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting task with id ${id}:`, error);
      throw error;
    }
  }

  async toggleTaskStatus(id: string, currentStatus: string): Promise<Task> {
    try {
      const newStatus = currentStatus === "PENDING" ? "COMPLETED" : "PENDING";
      const response = await apiClient.patch<Task>(`${this.BASE_URL}/${id}`, {
        status: newStatus,
      });
      return response.data;
    } catch (error) {
      console.error(`Error toggling status for task ${id}:`, error);
      throw error;
    }
  }

  async updateTaskPosition(id: string, position: number): Promise<Task> {
    try {
      const response = await apiClient.patch<Task>(
        `${this.BASE_URL}/${id}/position`,
        {
          position,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating position for task ${id}:`, error);
      throw error;
    }
  }
}

export const taskService = new TaskService();
