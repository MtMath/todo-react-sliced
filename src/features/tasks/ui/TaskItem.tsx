import React from "react";
import { Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { Task } from "entities/index";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { formatDate } from "shared/lib/date";
import { Button, Card } from "shared/ui";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (
    taskId: string,
    currentStatus: string
  ) => Promise<Task | boolean>;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const handleToggleStatus = async () => {
    await onToggleStatus(task.id, task.status);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.01 }}
      className="mb-3"
    >
      <Card className="border-0 shadow-sm h-100">
        <Card.Body className="p-3">
          <div className="d-flex align-items-start">
            <Form.Check
              type="checkbox"
              className="me-3 mt-1"
              checked={task.status === "COMPLETED"}
              onChange={handleToggleStatus}
              label=""
            />

            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5
                  className={`mb-0 ${
                    task.status === "COMPLETED"
                      ? "text-decoration-line-through text-muted"
                      : ""
                  }`}
                >
                  {task.title}
                </h5>

                <div>
                  <TaskStatusBadge status={task.status} size="sm" />
                </div>
              </div>

              {task.description && (
                <p
                  className={`mb-2 ${
                    task.status === "COMPLETED" ? "text-muted" : ""
                  }`}
                >
                  {task.description}
                </p>
              )}

              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Criada em {formatDate(task.createdAt)}
                </small>

                <div>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-primary p-1"
                    onClick={() => onEdit(task)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger p-1"
                    onClick={() => onDelete(task.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};
