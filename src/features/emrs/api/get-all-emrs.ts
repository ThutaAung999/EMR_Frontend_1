import { useQuery } from '@tanstack/react-query';
import { IEmr } from '../model/emr.model';

// Function to fetch patients from the API
export const fetchEmrs = async (): Promise<IEmr[]> => {
    console.log("fetchEmrs from frontent");

    
    const response = await fetch('https://emr-backend-intz.onrender.com/api/emrs');
    //const response = await fetch('http://localhost:9999/api/emrs');
    if (!response.ok) {
        throw new Error('Fail to fetch emrs');
    }
    return response.json();
};

// Hook to get emrs
const useGetEmrs = () => {
    return useQuery<IEmr[], Error>({
        queryKey: ['emrs'],
        queryFn: fetchEmrs,
        refetchOnWindowFocus: false,
    });
};

export default useGetEmrs


