import React from "react";
import { motion } from "framer-motion";
import { Button } from "../Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = "bi-inbox",
  actionText,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-5"
    >
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="d-inline-block bg-light rounded-circle p-4 mb-4">
          <i className={`bi ${icon} fs-1 text-primary`}></i>
        </div>
      </motion.div>

      <motion.h5
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="fw-bold mb-3"
      >
        {title}
      </motion.h5>

      {description && (
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted mb-4 px-4"
        >
          {description}
        </motion.p>
      )}

      {actionText && onAction && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button variant="primary" icon="bi-plus-circle" onClick={onAction}>
            {actionText}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
