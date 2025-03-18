import React, { useState } from "react";
import { Container, Button, Alert, Navbar, Nav } from "react-bootstrap";
import { TasksTable, TaskForm, useTasks, Task } from "features/tasks";
import { useAuthContext } from "features/auth";
import { motion } from "framer-motion";
import { MotivationalQuote } from "widgets/MotivationalQuote";

export const TasksPage: React.FC = () => {
  const { user, logout } = useAuthContext();
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const handleCreateTask = () => {
    setSelectedTask(undefined);
    setShowForm(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTask(undefined);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = async (taskData: any) => {
    if ("id" in taskData) {
      return await updateTask(taskData);
    } else {
      return await createTask(taskData);
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Task Manager</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <Nav.Item className="text-light d-flex align-items-center me-3">
                Welcome, {user?.name}
              </Nav.Item>
              <Button variant="outline-light" onClick={logout}>
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>My Tasks</h1>
            <Button onClick={handleCreateTask}>Add New Task</Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <MotivationalQuote />

          <TasksTable
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={deleteTask}
            onToggleStatus={toggleTaskStatus}
            loading={loading}
          />

          <TaskForm
            task={selectedTask}
            onSubmit={handleFormSubmit}
            onClose={handleCloseForm}
            show={showForm}
          />
        </motion.div>
      </Container>
    </>
  );
};
