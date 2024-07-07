import { useQuery } from "@tanstack/react-query";
import { ITag } from "../model/ITag";


// Fetch diseases
const fetchTags = async (): Promise<ITag[]> => {
  
  //const response = await fetch("http://localhost:9999/api/tags");
  const response = await fetch("https://emr-backend-intz.onrender.com/api/tags");
  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }
  return response.json();
};



export const useGetTags = () => {
  return useQuery<ITag[], Error>({
    queryKey: ['tags'],
    queryFn: fetchTags,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error.message.includes("429")) {
        // Retry up to 5 times with exponential backoff
        return failureCount < 5;
      }
      // Do not retry for other errors
      return false;
    },
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff up to 30 seconds
  });
};