import { useState, useEffect } from "react";
import { Task, CreateTaskDto, UpdateTaskDto } from "entities/task";

export const useTasks = (taskListId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Completar o desafio",
          description:
            "Implementar a aplicação web de gerenciamento de tarefas",
          status: "pending",
          createdAt: new Date(),
          taskListId: "1",
        },
        {
          id: "2",
          title: "Estudar React",
          description: "Aprofundar conhecimentos em hooks e TypeScript",
          status: "completed",
          createdAt: new Date(Date.now() - 86400000),
          taskListId: "1",
        },
        {
          id: "3",
          title: "Fazer compras",
          description: "Comprar mantimentos para a semana",
          status: "pending",
          createdAt: new Date(),
          taskListId: "2",
        },
      ];

      const filteredTasks = taskListId
        ? mockTasks.filter((task) => task.taskListId === taskListId)
        : mockTasks;

      setTasks(filteredTasks);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [taskListId]);

  const createTask = async (taskData: CreateTaskDto): Promise<boolean> => {
    try {
      const newTask: Task = {
        id: Date.now().toString(),
        ...taskData,
        status: "pending",
        createdAt: new Date(),
      };

      setTasks((prevTasks) => [...prevTasks, newTask]);
      return true;
    } catch (err) {
      setError("Failed to create task");
      console.error(err);
      return false;
    }
  };

  const updateTask = async (taskData: UpdateTaskDto): Promise<boolean> => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskData.id ? { ...task, ...taskData } : task
        )
      );
      return true;
    } catch (err) {
      setError("Failed to update task");
      console.error(err);
      return false;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      return true;
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
      return false;
    }
  };

  const toggleTaskStatus = async (id: string): Promise<boolean> => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? {
                ...task,
                status: task.status === "pending" ? "completed" : "pending",
              }
            : task
        )
      );
      return true;
    } catch (err) {
      setError("Failed to update task status");
      console.error(err);
      return false;
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  };
};
