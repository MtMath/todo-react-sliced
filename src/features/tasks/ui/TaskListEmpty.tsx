import React from "react";
import { motion } from "framer-motion";
import { Button, Card } from "shared/ui";

interface TaskListEmptyProps {
  onCreateTask?: () => void;
  hasSelectedList: boolean;
  onCreateList?: () => void;
}

export const TaskListEmpty: React.FC<TaskListEmptyProps> = ({
  onCreateTask,
  hasSelectedList,
  onCreateList,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-sm text-center py-5">
        <Card.Body>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
              <i
                className={`bi ${
                  hasSelectedList ? "bi-clipboard-plus" : "bi-list-task"
                } fs-1 text-primary`}
              ></i>
            </div>
            <h3 className="fw-bold">
              {hasSelectedList
                ? "Nenhuma tarefa encontrada"
                : "Selecione uma lista"}
            </h3>
            <p className="text-muted mb-4">
              {hasSelectedList
                ? "Esta lista ainda não possui tarefas. Comece adicionando sua primeira tarefa."
                : "Selecione uma lista à esquerda ou crie uma nova para começar."}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {hasSelectedList && onCreateTask ? (
              <Button
                variant="primary"
                size="lg"
                onClick={onCreateTask}
                className="px-4"
              >
                <i className="bi bi-plus-lg me-2"></i>
                Adicionar Tarefa
              </Button>
            ) : onCreateList ? (
              <Button
                variant="primary"
                size="lg"
                onClick={onCreateList}
                className="px-4"
              >
                <i className="bi bi-plus-lg me-2"></i>
                Criar Lista
              </Button>
            ) : null}
          </motion.div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};
