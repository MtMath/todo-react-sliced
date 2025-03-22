import React from "react";
import {
  Button as BootstrapButton,
  ButtonProps as BSButtonProps,
} from "react-bootstrap";
import { motion } from "framer-motion";

interface ButtonProps extends BSButtonProps {
  animation?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  animation = true,
  loading = false,
  loadingText,
  icon,
  ...props
}) => {
  const button = (
    <BootstrapButton {...props} disabled={props.disabled || loading}>
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          {loadingText || "Carregando..."}
        </>
      ) : (
        <>
          {icon && <i className={`bi ${icon} ${children ? "me-2" : ""}`}></i>}
          {children}
        </>
      )}
    </BootstrapButton>
  );

  if (animation) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        {button}
      </motion.div>
    );
  }

  return button;
};
