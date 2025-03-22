/**
 * Formata uma data para exibição amigável ao usuário
 * @param date Data no formato string ou objeto Date
 * @param options Opções de formatação (opcional)
 * @returns String formatada da data
 */
export const formatDate = (
  date: string | Date,
  options: {
    format?: "short" | "medium" | "long" | "relative";
    includeTime?: boolean;
    timeFormat?: "12h" | "24h";
  } = {}
): string => {
  const {
    format = "medium",
    includeTime = false,
    timeFormat = "24h",
  } = options;

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    console.error("Data inválida:", date);
    return "Data inválida";
  }

  const isToday = (someDate: Date) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  const isYesterday = (someDate: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      someDate.getDate() === yesterday.getDate() &&
      someDate.getMonth() === yesterday.getMonth() &&
      someDate.getFullYear() === yesterday.getFullYear()
    );
  };

  if (format === "relative") {
    if (isToday(dateObj)) {
      return includeTime
        ? `Hoje às ${formatTime(dateObj, timeFormat)}`
        : "Hoje";
    }
    if (isYesterday(dateObj)) {
      return includeTime
        ? `Ontem às ${formatTime(dateObj, timeFormat)}`
        : "Ontem";
    }

    const dayDiff = Math.floor(
      (new Date().getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (dayDiff < 7) {
      const dayNames = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
      ];
      return includeTime
        ? `${dayNames[dateObj.getDay()]} às ${formatTime(dateObj, timeFormat)}`
        : dayNames[dateObj.getDay()];
    }
  }

  let dateString = "";
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();

  switch (format) {
    case "short":
      dateString = `${day}/${month}/${year.toString().substring(2)}`;
      break;
    case "long":
      const monthNames = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
      dateString = `${day} de ${monthNames[dateObj.getMonth()]} de ${year}`;
      break;
    case "medium":
    default:
      dateString = `${day}/${month}/${year}`;
      break;
  }

  if (includeTime) {
    dateString += ` às ${formatTime(dateObj, timeFormat)}`;
  }

  return dateString;
};

/**
 * Função auxiliar para formatar o horário
 * @param date Objeto Date
 * @param format Formato do horário ('12h' ou '24h')
 * @returns String do horário formatado
 */
const formatTime = (date: Date, format: "12h" | "24h" = "24h"): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  if (format === "12h") {
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 deve ser 12 no formato 12h
    return `${hours}:${minutes} ${period}`;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
};

/**
 * Retorna uma string representando o tempo decorrido em formato relativo
 * Ex: "2 minutos atrás", "3 dias atrás", etc.
 * @param date Data a ser comparada com a data atual
 * @returns String representando o tempo relativo
 */
export const getRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Verificar se a data é válida
  if (isNaN(dateObj.getTime())) {
    console.error("Data inválida para cálculo de tempo relativo:", date);
    return "Data inválida";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  // Menos de 1 minuto
  if (diffInSeconds < 60) {
    return "agora mesmo";
  }

  // Menos de 1 hora
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minuto" : "minutos"} atrás`;
  }

  // Menos de 1 dia
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hora" : "horas"} atrás`;
  }

  // Menos de 1 semana
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? "dia" : "dias"} atrás`;
  }

  // Menos de 1 mês
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks === 1 ? "semana" : "semanas"} atrás`;
  }

  // Menos de 1 ano
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} ${months === 1 ? "mês" : "meses"} atrás`;
  }

  // Mais de 1 ano
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} ${years === 1 ? "ano" : "anos"} atrás`;
};

/**
 * Converte uma string de data para um objeto Date
 * @param dateString String de data em formato ISO ou outro formato válido
 * @param fallback Valor de fallback caso a conversão falhe
 * @returns Objeto Date ou o valor de fallback
 */
export const parseDate = (
  dateString: string,
  fallback: Date = new Date()
): Date => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? fallback : date;
};

/**
 * Retorna a data atual formatada
 * @param format Formato desejado
 * @param includeTime Se deve incluir o horário
 * @returns Data atual formatada
 */
export const getCurrentDate = (
  format: "short" | "medium" | "long" | "relative" = "medium",
  includeTime: boolean = false
): string => {
  return formatDate(new Date(), { format, includeTime });
};
