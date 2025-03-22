import React, { useState } from "react";
import { Badge, Dropdown } from "react-bootstrap";
import { Button, Card } from "shared/ui";
import { TaskList } from "entities/task-list/model/taskList";
import { motion, AnimatePresence } from "framer-motion";
import "./styles.css";

interface TaskListsSidebarProps {
  taskLists: TaskList[];
  loading: boolean;
  selectedListId?: string;
  onSelectList: (listId: string) => void;
  onCreateList: () => void;
  onEditList: (list: TaskList) => void;
  onDeleteList: (list: TaskList) => void;
  onSetDefaultList?: (list: TaskList) => void;
  taskCounts?: Record<string, { total: number; pending: number }>;
}

export const TaskListsSidebar: React.FC<TaskListsSidebarProps> = ({
  taskLists,
  loading,
  selectedListId,
  onSelectList,
  onCreateList,
  onEditList,
  onDeleteList,
  onSetDefaultList,
  taskCounts = {},
}) => {
  const [hoveredListId, setHoveredListId] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1,
      },
    },
    hover: {
      scale: 1.02,
      backgroundColor: "#f8f9fa",
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  };

  if (loading && taskLists.length === 0) {
    return (
      <Card className="border-0 shadow-sm h-100 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="d-flex justify-content-center align-items-center h-100"
        >
          <div className="text-center p-4">
            <div className="mb-3">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 1.5,
                  ease: "linear",
                  repeat: Infinity,
                }}
              >
                <i
                  className="bi bi-arrow-repeat text-primary"
                  style={{ fontSize: "2.5rem" }}
                ></i>
              </motion.div>
            </div>
            <h6 className="mb-3 text-primary fw-semibold">
              Carregando suas listas
            </h6>
            <p className="text-muted mb-0 small">Aguarde um momento...</p>
          </div>
        </motion.div>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm h-100 overflow-hidden modern-sidebar">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card.Header className="bg-white border-0 py-3 px-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold text-primary d-flex align-items-center">
              <i className="bi bi-collection me-2"></i>
              Minhas Listas
            </h5>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="primary"
                size="sm"
                onClick={onCreateList}
                className="rounded-circle d-flex justify-content-center align-items-center shadow-sm"
                style={{ width: "32px", height: "32px", padding: 0 }}
                title="Adicionar nova lista"
              >
                <i className="bi bi-plus" style={{ fontSize: "1.2rem" }}></i>
              </Button>
            </motion.div>
          </div>
        </Card.Header>
      </motion.div>

      <Card.Body className="p-0 overflow-auto">
        <AnimatePresence mode="wait">
          {taskLists.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-4 d-flex flex-column justify-content-center align-items-center"
              style={{ minHeight: "200px" }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-3 bg-light rounded-circle p-4 d-flex justify-content-center align-items-center"
                style={{ width: "80px", height: "80px" }}
              >
                <i
                  className="bi bi-list-check text-primary"
                  style={{ fontSize: "2rem" }}
                ></i>
              </motion.div>
              <h6 className="mb-3 text-dark">Nenhuma lista encontrada</h6>
              <p className="text-muted mb-4 px-4">
                Crie sua primeira lista para começar a organizar suas tarefas
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="primary"
                  className="px-4 py-2 shadow-sm"
                  onClick={onCreateList}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Criar nova lista
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="py-2"
            >
              {taskLists.map((list, index) => {
                const counts = taskCounts[list.id] || { total: 0, pending: 0 };
                const listColor = list.color || "#3498db";
                const isSelected = list.id === selectedListId;
                const isHovered = list.id === hoveredListId;

                return (
                  <motion.div
                    key={list.id}
                    custom={index}
                    variants={listItemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="px-3 task-list-item-container"
                  >
                    <div
                      onClick={() => onSelectList(list.id)}
                      className={`task-list-item ${
                        isSelected ? "selected" : ""
                      }`}
                      onMouseEnter={() => setHoveredListId(list.id)}
                      onMouseLeave={() => setHoveredListId(null)}
                      role="button"
                      aria-pressed={isSelected}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          onSelectList(list.id);
                          e.preventDefault();
                        }
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div
                            className="color-indicator"
                            style={{
                              backgroundColor: listColor,
                              transform: isSelected ? "scale(1.2)" : "scale(1)",
                            }}
                          />

                          <div className="task-list-content">
                            <div className="task-list-title">
                              <span>{list.name}</span>
                              {list.isDefault && (
                                <i
                                  className="bi bi-star-fill ms-2 text-warning"
                                  title="Lista padrão"
                                ></i>
                              )}
                            </div>

                            {counts.total > 0 && (
                              <div className="task-list-meta">
                                {counts.pending > 0 ? (
                                  <div className="task-pending">
                                    <Badge
                                      bg={isSelected ? "primary" : "warning"}
                                      text={isSelected ? "white" : "dark"}
                                      className="rounded-pill"
                                    >
                                      {counts.pending}
                                    </Badge>
                                    <span>pendentes</span>
                                  </div>
                                ) : (
                                  <div className="task-completed">
                                    <i className="bi bi-check-circle-fill text-success"></i>
                                    <span>completas</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div
                          onClick={(e) => e.stopPropagation()}
                          className={`list-actions ${
                            isHovered || isSelected ? "visible" : ""
                          }`}
                        >
                          <Dropdown align="end">
                            <Dropdown.Toggle
                              variant="link"
                              size="sm"
                              className="dropdown-toggle-no-caret"
                              id={`dropdown-task-list-${list.id}`}
                            >
                              <i className="bi bi-three-dots-vertical"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="shadow-sm border-0">
                              <Dropdown.Item onClick={() => onEditList(list)}>
                                <i className="bi bi-pencil me-2"></i> Editar
                              </Dropdown.Item>
                              {onSetDefaultList && !list.isDefault && (
                                <Dropdown.Item
                                  onClick={() => onSetDefaultList(list)}
                                >
                                  <i className="bi bi-star me-2"></i> Definir
                                  como padrão
                                </Dropdown.Item>
                              )}
                              <Dropdown.Divider />
                              <Dropdown.Item
                                onClick={() => onDeleteList(list)}
                                className="text-danger"
                              >
                                <i className="bi bi-trash me-2"></i> Excluir
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </Card.Body>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card.Footer className="bg-white border-top p-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline-primary"
              className="w-100 d-flex align-items-center justify-content-center py-2"
              onClick={onCreateList}
            >
              <i className="bi bi-plus-circle me-2"></i> Nova Lista
            </Button>
          </motion.div>
        </Card.Footer>
      </motion.div>
    </Card>
  );
};
