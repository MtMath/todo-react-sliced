import React from "react";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: React.ReactNode;
  fluid?: boolean;
  className?: string;
  animation?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  fluid = false,
  className = "",
  animation = true,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  return animation ? (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-100"
    >
      <Container fluid={fluid} className={`py-4 ${className}`}>
        {children}
      </Container>
    </motion.div>
  ) : (
    <Container fluid={fluid} className={`py-4 ${className}`}>
      {children}
    </Container>
  );
};
