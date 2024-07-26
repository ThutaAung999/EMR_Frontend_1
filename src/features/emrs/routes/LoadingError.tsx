import { Loader } from "@mantine/core";
import React from "react";

interface LoadingErrorProps {
  loading?: boolean;
  error?: boolean;
}

const LoadingError: React.FC<LoadingErrorProps> = ({ loading, error }) => {
  
  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <Loader />
      </div>
    );
  }
  if (error) return <div>Error</div>;
  return null;
};

export default LoadingError;
