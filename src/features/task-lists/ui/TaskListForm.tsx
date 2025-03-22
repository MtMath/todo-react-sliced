import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import { TaskList } from "entities/task-list/model/taskList";

interface TaskListFormProps {
  taskList?: TaskList;
  onSubmit: (data: any) => Promise<boolean>;
  onClose: () => void;
  show: boolean;
}

export const TaskListForm: React.FC<TaskListFormProps> = ({
  taskList,
  onSubmit,
  onClose,
  show,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3498db");
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colorOptions = [
    { name: "Azul", value: "#3498db" },
    { name: "Verde", value: "#2ecc71" },
    { name: "Roxo", value: "#9b59b6" },
    { name: "Vermelho", value: "#e74c3c" },
    { name: "Laranja", value: "#e67e22" },
    { name: "Amarelo", value: "#f1c40f" },
    { name: "Cinza", value: "#95a5a6" },
    { name: "Preto", value: "#34495e" },
  ];

  useEffect(() => {
    if (taskList) {
      setName(taskList.name);
      setDescription(taskList.description || "");
      setColor(taskList.color || "#3498db");
      setIsDefault(taskList.isDefault);
    } else {
      setName("");
      setDescription("");
      setColor("#3498db");
      setIsDefault(false);
    }

    setError(null);
  }, [taskList, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("O nome da lista é obrigatório");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = taskList
        ? {
            id: taskList.id,
            name,
            description: description || undefined,
            color,
            isDefault,
          }
        : {
            name,
            description: description || undefined,
            color,
            isDefault,
          };

      const success = await onSubmit(data);

      if (success) {
        onClose();
      } else {
        setError("Não foi possível salvar a lista");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocorreu um erro ao salvar a lista"
      );
      console.error("Error submitting task list:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{taskList ? "Editar Lista" : "Nova Lista"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome da lista"
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite uma descrição (opcional)"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cor</Form.Label>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {colorOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => setColor(option.value)}
                  className={`color-option ${
                    color === option.value ? "selected" : ""
                  }`}
                  style={{
                    backgroundColor: option.value,
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    border:
                      color === option.value
                        ? "2px solid #000"
                        : "1px solid #ddd",
                  }}
                  title={option.name}
                />
              ))}
            </div>
            <Form.Control
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Código de cor hexadecimal"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Definir como lista padrão"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
            />
            <Form.Text className="text-muted">
              A lista padrão será selecionada automaticamente ao entrar no
              aplicativo
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              style={{ backgroundColor: color, borderColor: color }}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
