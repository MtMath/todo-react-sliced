import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Offcanvas } from "react-bootstrap";
import { useTasks, Task, TaskForm } from "features/tasks";
import {
  TaskListsSidebar,
  TaskListForm,
  useTaskLists,
  TaskList,
} from "features/task-lists";
import { MotivationalQuote } from "widgets/MotivationalQuote";
import { motion } from "framer-motion";
import { PageContainer, AnimatedAlert, LoadingSpinner } from "shared/ui";

import { TaskListEmpty } from "features/tasks/ui/TaskListEmpty";
import { FloatingActionButton } from "features/tasks/ui/FloatingActionButton";
import { TaskCardView } from "features/tasks/ui/TaskCardView";
import { TaskConfirmDialog } from "features/tasks/ui/TaskConfirmDialog";
import { TaskFilters } from "features/tasks/ui/TaskFilters";
import { TaskHeader } from "features/tasks/ui/TaskHeader";

export const TasksPage: React.FC = () => {
  const {
    taskLists,
    loading: loadingLists,
    error: listsError,
    createTaskList,
    updateTaskList,
    deleteTaskList,
    setDefaultTaskList,
    getDefaultTaskList,
  } = useTaskLists();

  const [selectedListId, setSelectedListId] = useState<string | undefined>(
    undefined
  );
  const [confirmDelete, setConfirmDelete] = useState<{
    show: boolean;
    item: TaskList | Task | null;
    type: "list" | "task";
    loading: boolean;
  }>({
    show: false,
    item: null,
    type: "task",
    loading: false,
  });

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (window.innerWidth >= 768) {
        setShowSidebar(false);
      }
      if (!mobile && viewMode === "cards") {
        setViewMode("table");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [viewMode]);

  useEffect(() => {
    if (taskLists.length > 0 && !selectedListId) {
      const defaultList = getDefaultTaskList();
      if (defaultList) {
        setSelectedListId(defaultList.id);
      }
    }
  }, [taskLists, selectedListId, getDefaultTaskList]);

  const {
    tasks,
    loading: loadingTasks,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  } = useTasks(selectedListId);

  useEffect(() => {
    let filtered = [...tasks];

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, statusFilter, searchQuery]);

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

    tasks.forEach((task) => {
      if (task.taskListId && counts[task.taskListId]) {
        counts[task.taskListId].total += 1;
        if (task.status === "PENDING") {
          counts[task.taskListId].pending += 1;
        }
      }
    });

    setTaskCounts(counts);
  }, [taskLists, tasks]);

  const handleCreateTask = useCallback(() => {
    setSelectedTask(undefined);
    setShowTaskForm(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setSelectedTask(task);
    setShowTaskForm(true);
  }, []);

  const handleCloseTaskForm = useCallback(() => {
    setShowTaskForm(false);
    setSelectedTask(undefined);
  }, []);

  const handleTaskFormSubmit = useCallback(
    async (taskData: any) => {
      if ("id" in taskData) {
        return await updateTask(taskData);
      } else {
        return await createTask(taskData);
      }
    },
    [createTask, updateTask]
  );

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setConfirmDelete({
          show: true,
          item: task,
          type: "task",
          loading: false,
        });
      }
    },
    [tasks]
  );

  const handleConfirmDeleteTask = useCallback(async () => {
    if (confirmDelete.item && confirmDelete.type === "task") {
      setConfirmDelete((prev) => ({ ...prev, loading: true }));
      await deleteTask((confirmDelete.item as Task).id);
      setConfirmDelete({
        show: false,
        item: null,
        type: "task",
        loading: false,
      });
    }
  }, [confirmDelete, deleteTask]);

  const handleCreateList = useCallback(() => {
    setSelectedList(undefined);
    setShowListForm(true);
  }, []);

  const handleEditList = useCallback((list: TaskList) => {
    setSelectedList(list);
    setShowListForm(true);
  }, []);

  const handleCloseListForm = useCallback(() => {
    setShowListForm(false);
    setSelectedList(undefined);
  }, []);

  const handleListFormSubmit = useCallback(
    async (listData: any) => {
      if ("id" in listData) {
        return await updateTaskList(listData);
      } else {
        const success = await createTaskList(listData);
        if (success && (taskLists.length === 0 || listData.isDefault)) {
          setTimeout(() => {
            const defaultList = getDefaultTaskList();
            if (defaultList) {
              setSelectedListId(defaultList.id);
            }
          }, 100);
        }
        return success;
      }
    },
    [createTaskList, updateTaskList, taskLists.length, getDefaultTaskList]
  );

  const handleDeleteList = useCallback((list: TaskList) => {
    setConfirmDelete({
      show: true,
      item: list,
      type: "list",
      loading: false,
    });
  }, []);

  const handleConfirmDeleteList = useCallback(async () => {
    if (confirmDelete.item && confirmDelete.type === "list") {
      setConfirmDelete((prev) => ({ ...prev, loading: true }));
      const success = await deleteTaskList((confirmDelete.item as TaskList).id);
      if (success && selectedListId === (confirmDelete.item as TaskList).id) {
        const defaultList = getDefaultTaskList();
        if (defaultList) {
          setSelectedListId(defaultList.id);
        } else {
          setSelectedListId(undefined);
        }
      }
      setConfirmDelete({
        show: false,
        item: null,
        type: "list",
        loading: false,
      });
    }
  }, [confirmDelete, deleteTaskList, selectedListId, getDefaultTaskList]);

  const handleSetDefaultList = useCallback(
    async (list: TaskList) => {
      await setDefaultTaskList(list.id);
    },
    [setDefaultTaskList]
  );

  const handleSelectList = useCallback(
    (listId: string) => {
      setSelectedListId(listId);
      setStatusFilter("ALL");
      setSearchQuery("");
      if (isMobile) {
        setShowSidebar(false);
      }
    },
    [isMobile]
  );

  const handleClearFilters = useCallback(() => {
    setStatusFilter("ALL");
    setSearchQuery("");
  }, []);

  const currentList = taskLists.find((list) => list.id === selectedListId);

  const renderSidebarContent = () => (
    <TaskListsSidebar
      taskLists={taskLists}
      loading={loadingLists}
      selectedListId={selectedListId}
      onSelectList={handleSelectList}
      onCreateList={handleCreateList}
      onEditList={handleEditList}
      onDeleteList={handleDeleteList}
      onSetDefaultList={handleSetDefaultList}
      taskCounts={taskCounts}
    />
  );

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  if (loadingLists && taskLists.length === 0) {
    return (
      <LoadingSpinner text="Carregando suas listas de tarefas..." fullPage />
    );
  }

  return (
    <PageContainer fluid className="py-3 py-md-4">
      {isMobile && (
        <TaskHeader
          currentList={currentList}
          onCreateTask={handleCreateTask}
          onEditList={handleEditList}
          isMobile={true}
          onToggleSidebar={() => setShowSidebar(true)}
        />
      )}

      <Row>
        <Col md={3} lg={2} className="mb-4 mb-md-0 d-none d-md-block">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderSidebarContent()}

            <AnimatedAlert
              show={!!listsError}
              variant="danger"
              className="mt-3"
            >
              {listsError}
            </AnimatedAlert>
          </motion.div>
        </Col>

        <Offcanvas
          show={showSidebar}
          onHide={() => setShowSidebar(false)}
          placement="start"
          className="w-75"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Suas Listas</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {renderSidebarContent()}

            <AnimatedAlert
              show={!!listsError}
              variant="danger"
              className="mt-3"
            >
              {listsError}
            </AnimatedAlert>
          </Offcanvas.Body>
        </Offcanvas>

        <Col md={9} lg={10}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {!isMobile && (
              <TaskHeader
                currentList={currentList}
                onCreateTask={handleCreateTask}
                onEditList={handleEditList}
                isMobile={false}
              />
            )}

            <AnimatedAlert show={!!tasksError} variant="danger">
              {tasksError}
            </AnimatedAlert>

            <motion.div variants={itemVariants} className="mb-3">
              <MotivationalQuote />
            </motion.div>

            {!selectedListId ? (
              <motion.div variants={itemVariants}>
                <TaskListEmpty
                  hasSelectedList={false}
                  onCreateList={handleCreateList}
                />
              </motion.div>
            ) : (
              <motion.div variants={itemVariants}>
                {tasks.length > 0 && (
                  <TaskFilters
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                    onClearFilters={handleClearFilters}
                    totalTasks={tasks.length}
                    filteredTasksCount={filteredTasks.length}
                  />
                )}

                <TaskCardView
                  tasks={filteredTasks}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleStatus={toggleTaskStatus}
                  onCreateTask={handleCreateTask}
                  hasSelectedList={!!selectedListId}
                  loading={loadingTasks}
                />
              </motion.div>
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

            <TaskConfirmDialog
              show={confirmDelete.show}
              onClose={() =>
                setConfirmDelete({
                  show: false,
                  item: null,
                  type: "task",
                  loading: false,
                })
              }
              onConfirm={
                confirmDelete.type === "task"
                  ? handleConfirmDeleteTask
                  : handleConfirmDeleteList
              }
              item={confirmDelete.item}
              type={confirmDelete.type}
              loading={confirmDelete.loading}
            />

            {isMobile && selectedListId && (
              <FloatingActionButton
                onClick={handleCreateTask}
                disabled={!selectedListId}
              />
            )}
          </motion.div>
        </Col>
      </Row>
    </PageContainer>
  );
};
