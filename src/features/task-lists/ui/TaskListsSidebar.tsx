import React from "react";
import { ListGroup, Button, Spinner, Badge } from "react-bootstrap";
import { TaskList } from "entities/task-list";

interface TaskListsSidebarProps {
  taskLists: TaskList[];
  loading: boolean;
  selectedListId?: string;
  onSelectList: (listId: string) => void;
  onCreateList: () => void;
  onEditList: (list: TaskList) => void;
  taskCounts?: Record<string, { total: number; pending: number }>;
}

export const TaskListsSidebar: React.FC<TaskListsSidebarProps> = ({
  taskLists,
  loading,
  selectedListId,
  onSelectList,
  onCreateList,
  onEditList,
  taskCounts = {},
}) => {
  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="task-lists-sidebar">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">My Lists</h4>
        <Button variant="outline-primary" size="sm" onClick={onCreateList}>
          <i className="bi bi-plus"></i> Nova Lista
        </Button>
      </div>

      <ListGroup>
        {taskLists.length === 0 ? (
          <ListGroup.Item className="text-center text-muted">
            No list found
          </ListGroup.Item>
        ) : (
          taskLists.map((list) => {
            const counts = taskCounts[list.id] || { total: 0, pending: 0 };

            return (
              <ListGroup.Item
                key={list.id}
                active={list.id === selectedListId}
                action
                onClick={() => onSelectList(list.id)}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <span>{list.title}</span>
                  {counts.pending > 0 && (
                    <Badge bg="warning" className="ms-2">
                      {counts.pending}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="text-secondary p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditList(list);
                  }}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
              </ListGroup.Item>
            );
          })
        )}
      </ListGroup>
    </div>
  );
};
