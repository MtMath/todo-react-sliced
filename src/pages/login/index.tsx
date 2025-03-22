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
                    <motion.div variants={itemVariants} className="mb-3">
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

                    <motion.div variants={itemVariants} className="mb-3">
                      <Form.Group>
                        <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center mb-2">
                          <Form.Label className="mb-0">Senha</Form.Label>
                          <Link
                            to="/forgot-password"
                            className="text-decoration-none small text-md-end"
                            tabIndex={-1}
                          >
                            Esqueceu a senha?
                          </Link>
                        </div>
                        <div className="input-group">
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite sua senha"
                            required
                            disabled={loading}
                          />
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
                        </div>
                      </Form.Group>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-4">
                      <Form.Group>
                        <Form.Check
                          type="checkbox"
                          label="Lembrar de mim"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          disabled={loading}
                        />
                      </Form.Group>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-3">
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 py-2"
                        size="lg"
                        disabled={loading}
                        loading={loading}
                        loadingText="Entrando..."
                      >
                        Entrar
                      </Button>
                    </motion.div>
                  </motion.div>

                  <div className="text-center mt-4">
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.3 }}
                      className="mb-0"
                    >
                      Não tem uma conta?{" "}
                      <Link to="/register" className="text-decoration-none">
                        Registre-se
                      </Link>
                    </motion.p>
                  </div>
                </Card.Body>
              </Form>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </PageContainer>
  );
};
