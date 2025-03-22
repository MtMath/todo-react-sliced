import React from "react";
import { Modal, Alert } from "react-bootstrap";
import { TaskList } from "entities/task-list/model/taskList";
import { Task } from "entities/index";
import { Button } from "shared/ui";

interface TaskConfirmDialogProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: Task | TaskList | null;
  type: "task" | "list";
  loading?: boolean;
}

export const TaskConfirmDialog: React.FC<TaskConfirmDialogProps> = ({
  show,
  onClose,
  onConfirm,
  item,
  type,
  loading = false,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Exclusão</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {type === "task" && item ? (
          <p>
            Tem certeza que deseja excluir a tarefa{" "}
            <strong>"{(item as Task).title}"</strong>?
          </p>
        ) : type === "list" && item ? (
          <>
            <p>
              Tem certeza que deseja excluir a lista{" "}
              <strong>"{(item as TaskList).name}"</strong>?
            </p>
            <Alert variant="warning">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Todas as tarefas desta lista também serão excluídas.
            </Alert>
          </>
        ) : (
          <p>Tem certeza que deseja excluir este item?</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Excluindo...
            </>
          ) : (
            "Excluir"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
