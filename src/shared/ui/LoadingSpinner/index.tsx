import React from "react";
import { Spinner } from "react-bootstrap";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  text?: string;
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = "Carregando...",
  fullPage = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`d-flex flex-column justify-content-center align-items-center ${
        fullPage ? "vh-100" : "py-5"
      }`}
    >
      <Spinner animation="border" role="status" variant="primary" />
      {text && <p className="mt-3 text-muted">{text}</p>}
    </motion.div>
  );
};

