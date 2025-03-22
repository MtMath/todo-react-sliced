export { TaskListsSidebar } from "./ui/TaskListsSidebar";
export { TaskListForm } from "./ui/TaskListForm";
export { useTaskLists } from "./model/taskLists";

export type {
  TaskList,
  CreateTaskListDto,
  UpdateTaskListDto,
} from "entities/task-list/model/taskList";

export { taskListService } from "entities/task-list/api/taskListService";
