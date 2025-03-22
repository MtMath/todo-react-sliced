import { useState, useEffect, useCallback } from "react";
import {
  TaskList,
  CreateTaskListDto,
  UpdateTaskListDto,
} from "entities/task-list/model/taskList";
import { taskListService } from "entities/task-list/api/taskListService";

export const useTaskLists = () => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTaskLists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const listsData = await taskListService.getTaskLists();

      const sortedLists = [...listsData].sort(
        (a, b) => a.position - b.position
      );
      setTaskLists(sortedLists);
    } catch (err) {
      setError("Falha ao carregar listas de tarefas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTaskLists();
  }, [fetchTaskLists]);

  const createTaskList = async (
    listData: CreateTaskListDto
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const newList = await taskListService.createTaskList(listData);

      setTaskLists((prevLists) => [...prevLists, newList]);
      return true;
    } catch (err) {
      setError("Falha ao criar lista de tarefas");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTaskList = async (
    listData: UpdateTaskListDto
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const updatedList = await taskListService.updateTaskList(listData);

      setTaskLists((prevLists) =>
        prevLists.map((list) =>
          list.id === updatedList.id ? updatedList : list
        )
      );
      return true;
    } catch (err) {
      setError("Falha ao atualizar lista de tarefas");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTaskList = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      await taskListService.deleteTaskList(id);

      setTaskLists((prevLists) => prevLists.filter((list) => list.id !== id));
      return true;
    } catch (err) {
      setError("Falha ao excluir lista de tarefas");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const setDefaultTaskList = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const updatedList = await taskListService.setDefaultTaskList(id);

      setTaskLists((prevLists) =>
        prevLists.map((list) => ({
          ...list,
          isDefault: list.id === updatedList.id,
        }))
      );
      return true;
    } catch (err) {
      setError("Falha ao definir lista padrão");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTaskList = useCallback(() => {
    return (
      taskLists.find((list) => list.isDefault) ||
      (taskLists.length > 0 ? taskLists[0] : null)
    );
  }, [taskLists]);

  return {
    taskLists,
    loading,
    error,
    fetchTaskLists,
    createTaskList,
    updateTaskList,
    deleteTaskList,
    setDefaultTaskList,
    getDefaultTaskList,
  };
};
