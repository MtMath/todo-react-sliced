import React, { useState, useEffect } from "react";
import { Form, Modal, Alert } from "react-bootstrap";
import { Task } from "entities/task/model/task";
import { TaskList } from "entities/task-list/model/taskList";
import { Button } from "shared/ui";

interface TaskFormProps {
  task?: Task;
  taskLists: TaskList[];
  currentListId?: string;
  onSubmit: (taskData: any) => Promise<boolean>;
  onClose: () => void;
  show: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  taskLists,
  currentListId,
  onSubmit,
  onClose,
  show,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"PENDING" | "COMPLETED">("PENDING");
  const [taskListId, setTaskListId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setTaskListId(task.taskListId || "");
    } else {
      setTitle("");
      setDescription("");
      setStatus("PENDING");
      setTaskListId(
        currentListId || (taskLists.length > 0 ? taskLists[0].id : "")
      );
    }

    setError(null);
  }, [task, show, currentListId, taskLists]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("O título é obrigatório");
      return;
    }

    if (!taskListId) {
      setError("Selecione uma lista para a tarefa");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const taskData = task
        ? {
            id: task.id,
            title,
            description,
            status,
            taskListId,
          }
        : {
            title,
            description,
            taskListId,
          };

      const success = await onSubmit(taskData);

      if (success) {
        onClose();
      } else {
        setError("Não foi possível salvar a tarefa");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao salvar a tarefa"
      );
      console.error("Error submitting task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{task ? "Editar Tarefa" : "Nova Tarefa"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição da tarefa"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lista</Form.Label>
            <Form.Select
              value={taskListId}
              onChange={(e) => setTaskListId(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecione uma lista
              </option>
              {taskLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {task && (
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "PENDING" | "COMPLETED")
                }
              >
                <option value="PENDING">Pendente</option>
                <option value="COMPLETED">Concluída</option>
              </Form.Select>
            </Form.Group>
          )}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
