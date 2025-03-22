import React from "react";
import { Alert } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedAlertProps {
  show: boolean;
  variant: string;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const AnimatedAlert: React.FC<AnimatedAlertProps> = ({
  show,
  variant,
  onClose,
  children,
  className = "",
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert
            variant={variant}
            onClose={onClose}
            dismissible={!!onClose}
            className={className}
          >
            {children}
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
