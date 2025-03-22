import React from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import { motion } from "framer-motion";
import { Button } from "shared/ui";

interface TaskFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onClearFilters: () => void;
  totalTasks: number;
  filteredTasksCount: number;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  onClearFilters,
  totalTasks,
  filteredTasksCount,
}) => {
  const hasActiveFilters = statusFilter !== "ALL" || searchQuery.trim() !== "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <Row className="g-2 align-items-center">
        <Col xs={12} md={4} lg={3}>
          <Form.Select
            size="sm"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            aria-label="Filtrar por status"
          >
            <option value="ALL">Todas as tarefas</option>
            <option value="PENDING">Pendentes</option>
            <option value="COMPLETED">Concluídas</option>
          </Form.Select>
        </Col>

        <Col xs={12} md={6} lg={5}>
          <InputGroup size="sm">
            <Form.Control
              placeholder="Pesquisar tarefas..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              aria-label="Pesquisar tarefas"
            />
            {searchQuery && (
              <Button
                variant="outline-secondary"
                onClick={() => onSearchQueryChange("")}
              >
                <i className="bi bi-x"></i>
              </Button>
            )}
          </InputGroup>
        </Col>

        <Col xs="auto" className="ms-auto">
          <div className="d-flex align-items-center">
            {hasActiveFilters && (
              <Button
                variant="link"
                size="sm"
                className="text-decoration-none p-0 me-3"
                onClick={onClearFilters}
              >
                <i className="bi bi-x-circle me-1"></i>
                Limpar filtros
              </Button>
            )}

            <small className="text-muted">
              {filteredTasksCount} de {totalTasks}{" "}
              {totalTasks === 1 ? "tarefa" : "tarefas"}
            </small>
          </div>
        </Col>
      </Row>
    </motion.div>
  );
};
