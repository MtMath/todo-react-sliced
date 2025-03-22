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

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, loading, error, clearError } =
    useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tasks");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    clearError();

    const credentials = {
      email,
      password,
    };

    const success = await login(credentials);
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
      className="bg-light min-vh-100 d-flex align-items-center"
    >
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={5} xxl={4}>
          <Card>
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
                        className="bi bi-person-check-fill text-primary"
                        style={{ fontSize: "3rem" }}
                      ></i>
                    </div>
                    <h2 className="mb-1 fw-bold">Bem-vindo(a) de volta!</h2>
                    <p className="text-muted">
                      Entre com suas credenciais para continuar
                    </p>
                  </motion.div>

                  <AnimatedAlert
                    show={!!error}
                    variant="danger"
                    onClose={clearError}
                  >
                    {error}
                  </AnimatedAlert>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants}>
                    <FormField
                      label="Email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Digite seu email"
                      required
                      autoFocus
                      disabled={loading}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      label={
                        <div className="d-flex justify-content-between w-100">
                          <span>Senha</span>
                          <Link
                            to="/forgot-password"
                            className="text-decoration-none small"
                            tabIndex={-1}
                          >
                            Esqueceu a senha?
                          </Link>
                        </div>
                      }
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite sua senha"
                      required
                      disabled={loading}
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

                  <motion.div variants={itemVariants}>
                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        label="Lembrar de mim"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={loading}
                      />
                    </Form.Group>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 mb-3 py-2"
                      size="lg"
                      disabled={loading}
                      loading={loading}
                      loadingText="Entrando..."
                    >
                      Entrar
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="text-center mt-4"
                >
                  <p className="mb-0">
                    Não tem uma conta?{" "}
                    <Link to="/register" className="text-decoration-none">
                      Registre-se
                    </Link>
                  </p>
                </motion.div>
              </Card.Body>
            </Form>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
