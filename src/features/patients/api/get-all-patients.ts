/* import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { IPatient } from '../model/IPatient';

// Function to fetch patients from the API
export const fetchPatients = async (): Promise<IPatient[]> => {
  console.log("fetchPatients from frontend");

  const apiUrl = import.meta.env.VITE_API_URL;

  //const response = await fetch('http://localhost:9999/api/patients');
  //const response = await fetch('https://emr-backend-intz.onrender.com/api/patients');
  const response = await fetch(apiUrl+'api/patients');

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    throw new Error('Fail to fetch patients');
  }
  return response.json();
};

// Hook to get patients
const useGetPatients = () => {
  return useQuery<IPatient[], Error>(
    {
      queryKey: ['patients'],
      queryFn: fetchPatients,
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
    } as UseQueryOptions<IPatient[], Error> // Cast to UseQueryOptions to ensure type compatibility
  );
};

export default useGetPatients;

 */



import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { IPatient } from '../model/IPatient';

// Function to fetch patients from the API
export const fetchPatients = async (): Promise<IPatient[]> => {
  console.log("fetchPatients from frontend");

  

  const response = await fetch('http://localhost:9999/api/patients');
  //const response = await fetch('https://emr-backend-intz.onrender.com/api/patients');

  /* const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(apiUrl+'api/patients'); */

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    throw new Error('Fail to fetch patients');
  }
  return response.json();
};

// Hook to get patients
const useGetPatients = () => {
  return useQuery<IPatient[], Error>(
    {
      queryKey: ['patients'],
      queryFn: fetchPatients,
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
    } as UseQueryOptions<IPatient[], Error> // Cast to UseQueryOptions to ensure type compatibility
  );
};

export default useGetPatients;
