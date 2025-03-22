import React from "react";
import { TaskList } from "entities/task-list/model/taskList";
import { motion } from "framer-motion";
import { Button } from "react-bootstrap";

interface TaskHeaderProps {
  currentList?: TaskList;
  onCreateTask: () => void;
  onEditList: (list: TaskList) => void;
  isMobile: boolean;
  onToggleSidebar?: () => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  currentList,
  onCreateTask,
  onEditList,
  isMobile,
  onToggleSidebar,
}) => {
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="d-flex justify-content-between align-items-center mb-4"
    >
      {isMobile ? (
        <div className="d-flex justify-content-between align-items-center w-100">
          <Button
            variant="outline-primary"
            onClick={onToggleSidebar}
            className="me-2 d-flex align-items-center"
            aria-label="Open lists sidebar"
            size="sm"
          >
            <i className="bi bi-list me-1"></i>
            <span className="d-none d-sm-inline">Listas</span>
          </Button>

          <h1 className="fs-5 mb-0 text-truncate flex-grow-1 text-center">
            {currentList ? (
              <>
                {currentList.name}
                {currentList.isDefault && (
                  <i
                    className="bi bi-star-fill ms-2 text-warning"
                    style={{ fontSize: "0.8rem" }}
                  ></i>
                )}
              </>
            ) : (
              "Minhas Tarefas"
            )}
          </h1>

          <Button
            variant="primary"
            onClick={onCreateTask}
            disabled={!currentList}
            size="sm"
            className="d-flex align-items-center"
          >
            <i className="bi bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-1">Tarefa</span>
          </Button>
        </div>
      ) : (
        <>
          <div>
            <h1 className="fs-2 mb-0">
              {currentList ? (
                <>
                  {currentList.name}
                  {currentList.isDefault && (
                    <i
                      className="bi bi-star-fill ms-2 text-warning"
                      style={{ fontSize: "1rem" }}
                    ></i>
                  )}
                </>
              ) : (
                "Selecione uma Lista"
              )}
            </h1>
            {currentList?.description && (
              <p className="text-muted mt-1 mb-0">{currentList.description}</p>
            )}
          </div>

          <div>
            {currentList && (
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={() => onEditList(currentList)}
              >
                <i className="bi bi-pencil me-1"></i>
                Editar Lista
              </Button>
            )}
            <Button
              variant="primary"
              onClick={onCreateTask}
              disabled={!currentList}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Nova Tarefa
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
};
