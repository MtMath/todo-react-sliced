import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import {
  TaskList,
  CreateTaskListDto,
  UpdateTaskListDto,
} from "entities/task-list";

interface TaskListFormProps {
  taskList?: TaskList;
  onSubmit: (data: CreateTaskListDto | UpdateTaskListDto) => Promise<boolean>;
  onClose: () => void;
  show: boolean;
}

export const TaskListForm: React.FC<TaskListFormProps> = ({
  taskList,
  onSubmit,
  onClose,
  show,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskList) {
      setTitle(taskList.title);
      setDescription(taskList.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [taskList, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = taskList
        ? {
            id: taskList.id,
            title,
            description: description || undefined,
          }
        : {
            title,
            description: description || undefined,
          };

      const success = await onSubmit(data);

      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{taskList ? "Edit List" : "New List"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the list title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description (optional)"
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
