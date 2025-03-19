import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { Task } from "entities/task";
import { TaskList } from "entities/task-list";

interface TaskFormProps {
  task?: Task;
  taskLists: TaskList[];
  currentListId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const [status, setStatus] = useState<"pending" | "completed">("pending");
  const [taskListId, setTaskListId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setTaskListId(task.taskListId);
    } else {
      setTitle("");
      setDescription("");
      setStatus("pending");
      setTaskListId(
        currentListId || (taskLists.length > 0 ? taskLists[0].id : "")
      );
    }
  }, [task, show, currentListId, taskLists]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{task ? "Edit Task" : "Create New Task"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
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
              placeholder="Enter task description"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>List</Form.Label>
            <Form.Select
              value={taskListId}
              onChange={(e) => setTaskListId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a list
              </option>
              {taskLists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title}
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
                  setStatus(e.target.value as "pending" | "completed")
                }
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </Form.Group>
          )}

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
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
