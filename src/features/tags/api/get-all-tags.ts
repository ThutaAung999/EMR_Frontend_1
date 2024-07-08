import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ITag } from "../model/ITag";

// Fetch tags
export const fetchTags = async (): Promise<ITag[]> => {
  console.log("fetchTags from frontend");

  const response = await fetch("https://emr-backend-intz.onrender.com/api/tags");
  //const response = await fetch("http://localhost:9999/api/tags");
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    throw new Error("Failed to fetch tags");
  }
  return response.json();
};

// Hook to get tags
export const useGetTags = () => {
  return useQuery<ITag[], Error>(
    {
      queryKey: ['tags'],
      queryFn: fetchTags,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error.message === "Rate limit exceeded" && failureCount < 3) {
          return true;
        }
        return false;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    } as UseQueryOptions<ITag[], Error> // Cast to UseQueryOptions to ensure type compatibility
  );
};
