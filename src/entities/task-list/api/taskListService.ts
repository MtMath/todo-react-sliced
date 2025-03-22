import { apiClient } from "shared/api/api-client";
import {
  TaskList,
  CreateTaskListDto,
  UpdateTaskListDto,
} from "../model/taskList";

export class TaskListService {
  private readonly BASE_URL = "/task-lists";

  async getTaskLists(): Promise<TaskList[]> {
    try {
      const response = await apiClient.get<TaskList[]>(this.BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching task lists:", error);
      throw error;
    }
  }

  async getTaskListById(id: string): Promise<TaskList> {
    try {
      const response = await apiClient.get<TaskList>(`${this.BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task list with id ${id}:`, error);
      throw error;
    }
  }

  async createTaskList(listData: CreateTaskListDto): Promise<TaskList> {
    try {
      const response = await apiClient.post<TaskList>(this.BASE_URL, listData);
      return response.data;
    } catch (error) {
      console.error("Error creating task list:", error);
      throw error;
    }
  }

  async updateTaskList(listData: UpdateTaskListDto): Promise<TaskList> {
    try {
      const { id, ...updateData } = listData;
      const response = await apiClient.patch<TaskList>(
        `${this.BASE_URL}/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating task list with id ${listData.id}:`, error);
      throw error;
    }
  }

  async deleteTaskList(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting task list with id ${id}:`, error);
      throw error;
    }
  }

  async setDefaultTaskList(id: string): Promise<TaskList> {
    try {
      const response = await apiClient.patch<TaskList>(
        `${this.BASE_URL}/${id}/default`,
        {
          isDefault: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error setting task list ${id} as default:`, error);
      throw error;
    }
  }

  async updateTaskListPosition(
    id: string,
    position: number
  ): Promise<TaskList> {
    try {
      const response = await apiClient.patch<TaskList>(
        `${this.BASE_URL}/${id}/position`,
        {
          position,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating position for task list ${id}:`, error);
      throw error;
    }
  }
}

export const taskListService = new TaskListService();
