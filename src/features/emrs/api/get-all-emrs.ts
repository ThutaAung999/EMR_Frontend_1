import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { IEmr } from '../model/emr.model';

// Function to fetch EMRs from the API
export const fetchEmrs = async (): Promise<IEmr[]> => {
  console.log("fetchEmrs from frontend");

  const apiUrl = import.meta.env.VITE_API_URL;  

  //const response = await fetch('https://emr-backend-intz.onrender.com/api/emrs');
  const response = await fetch(apiUrl+'api/emrs');
  //const response = await fetch('http://localhost:9999/api/emrs');
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    throw new Error('Fail to fetch emrs');
  }
  return response.json();
};

// Hook to get EMRs
const useGetEmrs = () => {
  return useQuery<IEmr[], Error>(
    {
      queryKey: ['emrs'],
      queryFn: fetchEmrs,
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
    } as UseQueryOptions<IEmr[], Error> // Cast to UseQueryOptions to ensure type compatibility
  );
};

export default useGetEmrs;
