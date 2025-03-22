import React from "react";
import { Row, Col } from "react-bootstrap";
import { AnimatePresence, motion } from "framer-motion";
import { Task } from "entities/index";
import { TaskItem } from "./TaskItem";
import { TaskListEmpty } from "./TaskListEmpty";

interface TaskCardViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (
    taskId: string,
    currentStatus: string
  ) => Promise<Task | boolean>;
  onCreateTask?: () => void;
  hasSelectedList: boolean;
  onCreateList?: () => void;
  loading?: boolean;
}

export const TaskCardView: React.FC<TaskCardViewProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
  onCreateTask,
  hasSelectedList,
  onCreateList,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-3 text-muted">Carregando tarefas...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <TaskListEmpty
        onCreateTask={onCreateTask}
        hasSelectedList={hasSelectedList}
        onCreateList={onCreateList}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Row xs={1} md={2} lg={3} className="g-3">
        <AnimatePresence>
          {tasks.map((task) => (
            <Col key={task.id}>
              <TaskItem
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
              />
            </Col>
          ))}
        </AnimatePresence>
      </Row>
    </motion.div>
  );
};
