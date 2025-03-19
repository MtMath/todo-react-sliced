import { useState, useEffect } from "react";
import {
  TaskList,
  CreateTaskListDto,
  UpdateTaskListDto,
} from "entities/task-list";

export const useTaskLists = () => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskLists = async () => {
    try {
      setLoading(true);
      const mockTaskLists: TaskList[] = [
        {
          id: "1",
          title: "Trabalho",
          description: "Tarefas relacionadas ao trabalho",
          createdAt: new Date(),
          userId: "1",
        },
        {
          id: "2",
          title: "Pessoal",
          description: "Tarefas pessoais",
          createdAt: new Date(Date.now() - 86400000),
          userId: "1",
        },
      ];

      setTaskLists(mockTaskLists);
      setError(null);
    } catch (err) {
      setError("Failed to load task lists");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskLists();
  }, []);

  const createTaskList = async (
    taskListData: CreateTaskListDto
  ): Promise<boolean> => {
    try {
      const newTaskList: TaskList = {
        id: Date.now().toString(),
        ...taskListData,
        createdAt: new Date(),
        userId: "1",
      };

      setTaskLists((prevLists) => [...prevLists, newTaskList]);
      return true;
    } catch (err) {
      setError("Failed to create task list");
      console.error(err);
      return false;
    }
  };

  const updateTaskList = async (
    taskListData: UpdateTaskListDto
  ): Promise<boolean> => {
    try {
      setTaskLists((prevLists) =>
        prevLists.map((list) =>
          list.id === taskListData.id ? { ...list, ...taskListData } : list
        )
      );
      return true;
    } catch (err) {
      setError("Failed to update task list");
      console.error(err);
      return false;
    }
  };

  const deleteTaskList = async (id: string): Promise<boolean> => {
    try {
      setTaskLists((prevLists) => prevLists.filter((list) => list.id !== id));
      return true;
    } catch (err) {
      setError("Failed to delete task list");
      console.error(err);
      return false;
    }
  };

  return {
    taskLists,
    loading,
    error,
    fetchTaskLists,
    createTaskList,
    updateTaskList,
    deleteTaskList,
  };
};
