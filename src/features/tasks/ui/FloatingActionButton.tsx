import React from "react";
import { Button } from "react-bootstrap";
import { motion } from "framer-motion";

interface FloatingActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  disabled = false,
  icon = "bi-plus-lg",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: "spring" }}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        onClick={onClick}
        disabled={disabled}
        size="lg"
        className="rounded-circle shadow"
        style={{ width: "56px", height: "56px", padding: 0 }}
      >
        <i className={`bi ${icon}`} style={{ fontSize: "24px" }}></i>
      </Button>
    </motion.div>
  );
};
