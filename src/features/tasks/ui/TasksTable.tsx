import React, { useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Button, Badge, Form } from "react-bootstrap";
import { Task } from "entities/task";

interface TasksTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  loading: boolean;
}

export const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
  loading,
}) => {
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesText =
      task.title.toLowerCase().includes(filterText.toLowerCase()) ||
      task.description.toLowerCase().includes(filterText.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    return matchesText && matchesStatus;
  });

  const columns: TableColumn<Task>[] = [
    {
      name: "Title",
      selector: (row: Task) => row.title,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row: Task) => row.description,
      sortable: true,
      wrap: true,
    },
    {
      name: "Status",
      selector: (row: Task) => row.status,
      sortable: true,
      cell: (row: Task) => (
        <Badge bg={row.status === "completed" ? "success" : "warning"}>
          {row.status === "completed" ? "Completed" : "Pending"}
        </Badge>
      ),
    },
    {
      name: "Created At",
      selector: (row: Task) => row.createdAt.toISOString(),
      sortable: true,
      format: (row: Task) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      name: "Actions",
      cell: (row: Task) => (
        <div className="d-flex gap-2">
          <Button size="sm" variant="primary" onClick={() => onEdit(row)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant={row.status === "completed" ? "warning" : "success"}
            onClick={() => onToggleStatus(row.id)}
          >
            {row.status === "completed" ? "Mark Pending" : "Mark Complete"}
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Group className="w-50">
          <Form.Control
            type="text"
            placeholder="Search tasks..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Form.Select>
        </Form.Group>
      </div>

      <DataTable
        columns={columns}
        data={filteredTasks}
        pagination
        progressPending={loading}
        responsive
        highlightOnHover
        striped
      />
    </div>
  );
};
