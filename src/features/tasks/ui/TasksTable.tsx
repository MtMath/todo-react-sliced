import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Badge, Form, Spinner } from "react-bootstrap";
import { Task } from "entities/task/model/task";
import { useDragAndDrop } from "../model/useDragAndDrop";
import { Button } from "shared/ui";

interface TasksTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onTasksReordered?: (tasks: Task[]) => void;
  loading: boolean;
}

export const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
  onTasksReordered = () => {},
  loading,
}) => {
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    tasks: orderedTasks,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    isDragging,
    draggedTaskId,
  } = useDragAndDrop(tasks, onTasksReordered);

  const filteredTasks = orderedTasks.filter((task) => {
    const matchesText =
      task.title.toLowerCase().includes(filterText.toLowerCase()) ||
      task.description.toLowerCase().includes(filterText.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    return matchesText && matchesStatus;
  });

  const columns = [
    {
      name: "Título",
      selector: (row: Task) => row.title,
      sortable: true,
      cell: (row: Task) => (
        <div
          draggable
          onDragStart={() => handleDragStart(row.id)}
          onDragOver={(e) => handleDragOver(e, row.id)}
          onDragEnd={handleDragEnd}
          className={`drag-item ${
            isDragging && draggedTaskId === row.id ? "dragging" : ""
          }`}
          style={{ cursor: "move", padding: "8px 0" }}
        >
          {row.title}
        </div>
      ),
    },
    {
      name: "Descrição",
      selector: (row: Task) => row.description,
      sortable: true,
      wrap: true,
    },
    {
      name: "Status",
      selector: (row: Task) => row.status,
      sortable: true,
      cell: (row: Task) => (
        <Badge bg={row.status === "COMPLETED" ? "success" : "warning"}>
          {row.status === "COMPLETED" ? "Concluída" : "Pendente"}
        </Badge>
      ),
    },
    {
      name: "Criado em",
      selector: (row: Task) => row.createdAt.toString(),
      sortable: true,
      format: (row: Task) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      name: "Ações",
      cell: (row: Task) => (
        <div className="d-flex gap-2">
          <Button size="sm" variant="primary" onClick={() => onEdit(row)}>
            <i className="bi bi-pencil"></i>
          </Button>
          <Button
            size="sm"
            variant={row.status === "COMPLETED" ? "warning" : "success"}
            onClick={() => onToggleStatus(row.id)}
          >
            {row.status === "COMPLETED" ? (
              <i className="bi bi-x-circle"></i>
            ) : (
              <i className="bi bi-check-circle"></i>
            )}
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(row.id)}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      ),
    },
  ];

  if (loading && tasks.length === 0) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Group className="w-50">
          <Form.Control
            type="text"
            placeholder="Buscar tarefas..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="PENDING">Pendentes</option>
            <option value="COMPLETED">Concluídas</option>
          </Form.Select>
        </Form.Group>
      </div>

      <DataTable
        columns={columns}
        data={filteredTasks}
        pagination
        progressPending={loading && tasks.length > 0}
        responsive
        highlightOnHover
        striped
        noDataComponent={
          <div className="p-4 text-center text-muted">
            <i className="bi bi-inbox display-4 d-block mb-3"></i>
            Nenhuma tarefa encontrada
          </div>
        }
      />

      <style>{`
        .drag-item.dragging {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};
