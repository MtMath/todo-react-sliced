import { useState, useCallback } from "react";
import { Task } from "entities/task/model/task";
import { taskService } from "entities/task/api/taskService";

export const useDragAndDrop = (
  initialTasks: Task[],
  onTasksReordered: (tasks: Task[]) => void
) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  if (JSON.stringify(initialTasks) !== JSON.stringify(tasks) && !isDragging) {
    setTasks(initialTasks);
  }

  const handleDragStart = useCallback((taskId: string) => {
    setIsDragging(true);
    setDraggedTaskId(taskId);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetTaskId: string) => {
      e.preventDefault();

      if (!draggedTaskId || draggedTaskId === targetTaskId) {
        return;
      }

      const draggedTaskIndex = tasks.findIndex(
        (task) => task.id === draggedTaskId
      );
      const targetTaskIndex = tasks.findIndex(
        (task) => task.id === targetTaskId
      );

      if (draggedTaskIndex < 0 || targetTaskIndex < 0) {
        return;
      }

      const newTasks = [...tasks];
      const [draggedTask] = newTasks.splice(draggedTaskIndex, 1);
      newTasks.splice(targetTaskIndex, 0, draggedTask);

      const updatedTasks = newTasks.map((task, index) => ({
        ...task,
        position: index,
      }));

      setTasks(updatedTasks);
    },
    [draggedTaskId, tasks]
  );

  const handleDragEnd = useCallback(async () => {
    if (!isDragging || !draggedTaskId) {
      return;
    }

    setIsDragging(false);
    setDraggedTaskId(null);

    onTasksReordered(tasks);

    try {
      const updatePromises = tasks.map((task) =>
        taskService.updateTaskPosition(task.id, task.position)
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Erro ao atualizar posições das tarefas:", error);
      setTasks(initialTasks);
    }
  }, [isDragging, draggedTaskId, tasks, initialTasks, onTasksReordered]);

  return {
    tasks,
    isDragging,
    draggedTaskId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
