import React from "react";

interface LoadingErrorProps {
  loading?: boolean;
  error?: boolean;
}

const LoadingError: React.FC<LoadingErrorProps> = ({ loading, error }) => {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  return null;
};

export default LoadingError;
