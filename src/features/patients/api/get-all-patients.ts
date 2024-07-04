import { useQuery } from '@tanstack/react-query';
import { IPatient } from '../model/IPatient';

// Function to fetch patients from the API
export const fetchPatients = async (): Promise<IPatient[]> => {
    console.log("fetchPatients from frontent");
    const response = await fetch('http://localhost:9999/api/patients');
    if (!response.ok) {
        throw new Error('Fail to fetch patients');
    }
    return response.json();
};

// Hook to get patients
const useGetPatients = () => {
    return useQuery<IPatient[], Error>({
        queryKey: ['patients'],
        queryFn: fetchPatients,
        refetchOnWindowFocus: false,
    });
};

export default useGetPatients


