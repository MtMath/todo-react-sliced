import React from "react";
import { Card as BootstrapCard } from "react-bootstrap";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animation?: boolean;
  delay?: number;
}

const CardComponent: React.FC<CardProps> = ({
  children,
  className = "",
  animation = true,
  delay = 0,
}) => {
  return animation ? (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <BootstrapCard className={`shadow-sm border-0 ${className}`}>
        {children}
      </BootstrapCard>
    </motion.div>
  ) : (
    <BootstrapCard className={`shadow-sm border-0 ${className}`}>
      {children}
    </BootstrapCard>
  );
};

export const Card = Object.assign(CardComponent, {
  Header: BootstrapCard.Header,
  Body: BootstrapCard.Body,
  Footer: BootstrapCard.Footer,
  Title: BootstrapCard.Title,
  Subtitle: BootstrapCard.Subtitle,
  Text: BootstrapCard.Text,
  Link: BootstrapCard.Link,
  Img: BootstrapCard.Img,
  ImgOverlay: BootstrapCard.ImgOverlay,
});
