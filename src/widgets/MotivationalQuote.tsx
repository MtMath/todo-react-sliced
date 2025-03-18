import React, { useState, useEffect } from "react";
import { Alert, Spinner } from "react-bootstrap";
import axios from "axios";

interface QuoteData {
  content: string;
  author: string;
}

export const MotivationalQuote: React.FC = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://api.quotable.io/random?tags=inspirational,motivational"
        );
        setQuote({
          content: response.data.content,
          author: response.data.author || "Unknown",
        });
      } catch (err) {
        setError("Não foi possível carregar a citação motivacional");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (loading)
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando citação...</span>
        </Spinner>
      </div>
    );

  if (error) return <Alert variant="warning">{error}</Alert>;
  if (!quote) return null;

  return (
    <Alert variant="info" className="mt-3 mb-4">
      <blockquote className="blockquote mb-0">
        <p>{quote.content}</p>
        <footer className="blockquote-footer">{quote.author}</footer>
      </blockquote>
    </Alert>
  );
};
