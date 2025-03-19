import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Navbar,
  Nav,
} from "react-bootstrap";
import { TasksTable, TaskForm, useTasks } from "features/tasks";
import {
  TaskListsSidebar,
  TaskListForm,
  useTaskLists,
  TaskList,
} from "features/task-lists";
import { useAuthContext } from "features/auth";
import { MotivationalQuote } from "widgets/MotivationalQuote";
import { motion } from "framer-motion";
import { Task } from "entities/task";

export const TasksPage: React.FC = () => {
  const { user, logout } = useAuthContext();
  const {
    taskLists,
    loading: loadingLists,
    error: listsError,
    createTaskList,
    updateTaskList,
  } = useTaskLists();

  const [selectedListId, setSelectedListId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (taskLists.length > 0 && !selectedListId) {
      setSelectedListId(taskLists[0].id);
    }
  }, [taskLists, selectedListId]);

  const {
    tasks,
    loading: loadingTasks,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  } = useTasks(selectedListId);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showListForm, setShowListForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [selectedList, setSelectedList] = useState<TaskList | undefined>(
    undefined
  );

  const [taskCounts, setTaskCounts] = useState<
    Record<string, { total: number; pending: number }>
  >({});

  useEffect(() => {
    const counts: Record<string, { total: number; pending: number }> = {};

    taskLists.forEach((list) => {
      counts[list.id] = { total: 0, pending: 0 };
    });

    const fetchAllTasks = async () => {
      try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const allTasksHook = useTasks();
        const allTasks = allTasksHook.tasks;

        allTasks.forEach((task) => {
          if (counts[task.taskListId]) {
            counts[task.taskListId].total += 1;
            if (task.status === "pending") {
              counts[task.taskListId].pending += 1;
            }
          }
        });

        setTaskCounts(counts);
      } catch (error) {
        console.error("Error loading task counts:", error);
      }
    };

    fetchAllTasks();
  }, [taskLists, tasks]);

  const handleCreateTask = () => {
    setSelectedTask(undefined);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setSelectedTask(undefined);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTaskFormSubmit = async (taskData: any) => {
    if ("id" in taskData) {
      return await updateTask(taskData);
    } else {
      return await createTask(taskData);
    }
  };

  const handleCreateList = () => {
    setSelectedList(undefined);
    setShowListForm(true);
  };

  const handleEditList = (list: TaskList) => {
    setSelectedList(list);
    setShowListForm(true);
  };

  const handleCloseListForm = () => {
    setShowListForm(false);
    setSelectedList(undefined);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleListFormSubmit = async (listData: any) => {
    if ("id" in listData) {
      return await updateTaskList(listData);
    } else {
      const success = await createTaskList(listData);
      if (success && !selectedListId && taskLists.length === 0) {
        setSelectedListId(taskLists[taskLists.length - 1]?.id);
      }
      return success;
    }
  };

  const handleSelectList = (listId: string) => {
    setSelectedListId(listId);
  };

  const currentList = taskLists.find((list) => list.id === selectedListId);

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

      <Container fluid className="py-4">
        <Row>
          <Col md={3} lg={2} className="mb-4 mb-md-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <TaskListsSidebar
                taskLists={taskLists}
                loading={loadingLists}
                selectedListId={selectedListId}
                onSelectList={handleSelectList}
                onCreateList={handleCreateList}
                onEditList={handleEditList}
                taskCounts={taskCounts}
              />

              {listsError && (
                <Alert variant="danger" className="mt-3">
                  {listsError}
                </Alert>
              )}
            </motion.div>
          </Col>

          <Col md={9} lg={10}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>{currentList ? currentList.title : "Todas as Tarefas"}</h1>
                <div>
                  {currentList && (
                    <Button
                      variant="outline-secondary"
                      className="me-2"
                      onClick={() => handleEditList(currentList)}
                    >
                      Edit List
                    </Button>
                  )}
                  <Button onClick={handleCreateTask} disabled={!selectedListId}>
                    New Task
                  </Button>
                </div>
              </div>

              {currentList?.description && (
                <p className="text-muted mb-4">{currentList.description}</p>
              )}

              {tasksError && <Alert variant="danger">{tasksError}</Alert>}

              <MotivationalQuote />

              {!selectedListId ? (
                <Alert variant="info">
                  Select a list on the left or create a new one to start adding
                  tasks.
                </Alert>
              ) : (
                <TasksTable
                  tasks={tasks}
                  onEdit={handleEditTask}
                  onDelete={deleteTask}
                  onToggleStatus={toggleTaskStatus}
                  loading={loadingTasks}
                />
              )}

              <TaskForm
                task={selectedTask}
                taskLists={taskLists}
                currentListId={selectedListId}
                onSubmit={handleTaskFormSubmit}
                onClose={handleCloseTaskForm}
                show={showTaskForm}
              />

              <TaskListForm
                taskList={selectedList}
                onSubmit={handleListFormSubmit}
                onClose={handleCloseListForm}
                show={showListForm}
              />
            </motion.div>
          </Col>
        </Row>
      </Container>
    </>
  );
};
