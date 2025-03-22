import { TaskStatus } from "entities/index";
import React from "react";
import { Badge } from "react-bootstrap";

interface TaskStatusBadgeProps {
  status: TaskStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  size = "md",
  showIcon = true,
}) => {
  const getVariant = (status: TaskStatus) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "PENDING":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getIcon = (status: TaskStatus) => {
    switch (status) {
      case "COMPLETED":
        return "bi-check-circle-fill";
      case "PENDING":
        return "bi-hourglass-split";
      default:
        return "bi-dash-circle";
    }
  };

  const getLabel = (status: TaskStatus) => {
    switch (status) {
      case "COMPLETED":
        return "Concluída";
      case "PENDING":
        return "Pendente";
      default:
        return status;
    }
  };

  const getSizeClass = (size: "sm" | "md" | "lg") => {
    switch (size) {
      case "sm":
        return "px-2 py-1 fs-8";
      case "lg":
        return "px-3 py-2 fs-6";
      default:
        return "px-2 py-1 fs-7";
    }
  };

  return (
    <Badge
      bg={getVariant(status)}
      text={status === "PENDING" ? "dark" : "white"}
      className={`rounded-pill ${getSizeClass(size)}`}
    >
      {showIcon && <i className={`${getIcon(status)} me-1`}></i>}
      {getLabel(status)}
    </Badge>
  );
};
