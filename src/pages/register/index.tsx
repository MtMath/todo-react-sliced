import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "features/auth";
import { motion } from "framer-motion";
import {
  PageContainer,
  Card,
  Button,
  FormField,
  AnimatedAlert,
} from "shared/ui";

export const RegisterPage: React.FC = () => {
  const { register, isAuthenticated, loading, error, clearError } =
    useAuthContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tasks");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    clearError();
    setValidationError(null);

    if (!username || username.length < 3) {
      setValidationError("O nome de usuário deve ter pelo menos 3 caracteres");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setValidationError("Digite um endereço de e-mail válido");
      return false;
    }

    if (!password || password.length < 6) {
      setValidationError("A senha deve ter pelo menos 6 caracteres");
      return false;
    }

    if (password !== confirmPassword) {
      setValidationError("As senhas não coincidem");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const credentials = {
      username,
      email,
      password,
    };

    const success = await register(credentials);
    if (success) {
      navigate("/tasks");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <PageContainer
      fluid
      className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5"
    >
      <Row className="justify-content-center w-100 m-0">
        <Col xs={12} sm={10} md={8} lg={6} xl={5} xxl={4} className="px-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-sm border-0">
              <Form onSubmit={handleSubmit}>
                <Card.Body className="p-4 p-md-5">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center mb-4"
                  >
                    <motion.div variants={itemVariants}>
                      <div className="mb-4">
                        <i
                          className="bi bi-person-plus-fill text-primary"
                          style={{ fontSize: "3rem" }}
                        ></i>
                      </div>
                      <h2 className="mb-1 fw-bold">Criar uma Conta</h2>
                      <p className="text-muted">
                        Registre-se para começar a gerenciar suas tarefas
                      </p>
                    </motion.div>

                    <AnimatedAlert
                      show={!!(error || validationError)}
                      variant="danger"
                      onClose={() => {
                        clearError();
                        setValidationError(null);
                      }}
                    >
                      {validationError || error}
                    </AnimatedAlert>
                  </motion.div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants} className="mb-3">
                      <FormField
                        label="Nome de Usuário"
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Digite seu nome de usuário"
                        required
                        autoFocus
                        disabled={loading}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-3">
                      <FormField
                        label="Email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite seu email"
                        required
                        disabled={loading}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-3">
                      <FormField
                        label="Senha"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite sua senha"
                        required
                        disabled={loading}
                        hint="A senha deve ter pelo menos 6 caracteres"
                        rightElement={
                          <Button
                            variant="outline-secondary"
                            onClick={togglePasswordVisibility}
                            type="button"
                            animation={false}
                          >
                            <i
                              className={`bi bi-eye${
                                showPassword ? "-slash" : ""
                              }`}
                            ></i>
                          </Button>
                        }
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-4">
                      <FormField
                        label="Confirmar Senha"
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirme sua senha"
                        required
                        disabled={loading}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-3">
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 py-2"
                        size="lg"
                        disabled={loading}
                        loading={loading}
                        loadingText="Registrando..."
                      >
                        Registrar
                      </Button>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-4"
                  >
                    <p className="mb-0">
                      Já tem uma conta?{" "}
                      <Link to="/login" className="text-decoration-none">
                        Entre aqui
                      </Link>
                    </p>
                  </motion.div>
                </Card.Body>
              </Form>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </PageContainer>
  );
};
