import React from "react";
import { Form, InputGroup } from "react-bootstrap";

interface FormFieldProps {
  label?: string | React.ReactNode;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  autoFocus?: boolean;
  className?: string;
  hint?: string;
  rightElement?: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  autoFocus = false,
  className = "",
  hint,
  rightElement,
}) => {
  return (
    <Form.Group className={`mb-3 ${className}`}>
      {label && <Form.Label>{label}</Form.Label>}

      {rightElement ? (
        <InputGroup>
          <Form.Control
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            autoFocus={autoFocus}
            isInvalid={!!error}
          />
          {rightElement}
          {error && (
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          )}
        </InputGroup>
      ) : (
        <>
          <Form.Control
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            autoFocus={autoFocus}
            isInvalid={!!error}
          />
          {error && (
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          )}
        </>
      )}

      {hint && <Form.Text className="text-muted">{hint}</Form.Text>}
    </Form.Group>
  );
};
