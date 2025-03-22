import axios, { AxiosError } from "axios";

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  timestamp?: string;
  path?: string;
}

export class ApiErrorHandler extends Error {
  statusCode: number;
  path?: string;
  timestamp?: string;

  constructor(error: AxiosError<ApiError> | Error) {
    let message = "Ocorreu um erro inesperado";
    let statusCode = 500;
    let path: string | undefined;
    let timestamp: string | undefined;

    if (axios.isAxiosError(error) && error.response) {
      const apiError = error.response.data;
      message =
        apiError.message ||
        `Erro ${error.response.status}: ${error.response.statusText}`;
      statusCode = apiError.statusCode || error.response.status;
      path = apiError.path || error.config?.url;
      timestamp = apiError.timestamp || new Date().toISOString();
    } else if (error instanceof Error) {
      message = error.message;
    }

    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.path = path;
    this.timestamp = timestamp;
  }

  getFriendlyMessage(): string {
    switch (this.statusCode) {
      case 400:
        return "Dados inválidos. Por favor, verifique as informações enviadas.";
      case 401:
        return "Sessão expirada. Por favor, faça login novamente.";
      case 403:
        return "Você não tem permissão para acessar este recurso.";
      case 404:
        return "O recurso solicitado não foi encontrado.";
      case 409:
        return "Ocorreu um conflito com o estado atual do recurso.";
      case 422:
        return "Não foi possível processar a solicitação. Verifique os campos informados.";
      case 429:
        return "Muitas requisições. Por favor, tente novamente mais tarde.";
      case 500:
        return "Erro interno do servidor. Por favor, tente novamente mais tarde.";
      case 501:
        return "Não implementado. Por favor, tente novamente mais tarde.";
      case 502:
        return "Erro de gateway. Por favor, tente novamente mais tarde.";
      case 503:
        return "Serviço indisponível. Por favor, tente novamente mais tarde.";
      case 504:
        return "Erro no servidor. Por favor, tente novamente mais tarde.";
      default:
        return this.message;
    }
  }

  static handle(error: unknown): ApiErrorHandler {
    if (error instanceof ApiErrorHandler) {
      return error;
    }

    return new ApiErrorHandler(error as AxiosError<ApiError> | Error);
  }
}

export function extractErrorMessage(error: unknown): string {
  return ApiErrorHandler.handle(error).getFriendlyMessage();
}
