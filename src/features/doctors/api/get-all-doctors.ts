import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IDoctor } from "../model/IDoctor";

// Fetch doctors
export const fetchDoctors = async (): Promise<IDoctor[]> => {
  console.log("fetchDoctors from frontend");

  const response = await fetch("https://emr-backend-intz.onrender.com/api/doctors");
  //const response = await fetch("http://localhost:9999/api/doctors");
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    throw new Error("Failed to fetch doctors");
  }
  return response.json();
};

// Hook to get doctors
export const useGetDoctors = () => {
  return useQuery<IDoctor[], Error>(
    {
      queryKey: ['doctors'],
      queryFn: fetchDoctors,
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
    } as UseQueryOptions<IDoctor[], Error> // Cast to UseQueryOptions to ensure type compatibility
  );
};
