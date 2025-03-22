import { useState, useEffect, useCallback } from "react";
import { Task, CreateTaskDto, UpdateTaskDto } from "entities/task/model/task";
import { taskService } from "entities/task/api/taskService";

export const useTasks = (taskListId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskService.getTasks(taskListId);
      setTasks(tasksData);
    } catch (err) {
      setError("Falha ao carregar tarefas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [taskListId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskData: CreateTaskDto): Promise<boolean> => {
    try {
      setLoading(true);
      const newTask = await taskService.createTask({
        ...taskData,
        taskListId: taskListId || taskData.taskListId,
      });

      setTasks((prevTasks) => [...prevTasks, newTask]);
      return true;
    } catch (err) {
      setError("Falha ao criar tarefa");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskData: UpdateTaskDto): Promise<boolean> => {
    try {
      setLoading(true);
      const updatedTask = await taskService.updateTask(taskData);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      return true;
    } catch (err) {
      setError("Falha ao atualizar tarefa");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      await taskService.deleteTask(id);

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      return true;
    } catch (err) {
      setError("Falha ao excluir tarefa");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const task = tasks.find((t) => t.id === id);

      if (!task) {
        throw new Error("Tarefa não encontrada");
      }

      const updatedTask = await taskService.toggleTaskStatus(id, task.status);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      return true;
    } catch (err) {
      setError("Falha ao atualizar status da tarefa");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
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
