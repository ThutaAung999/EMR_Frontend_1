import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IDisease, IDiseaseDTO } from "../model/IDisease";

export function useCreateDisease(onSuccessCallback?: () => void) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (disease: IDiseaseDTO) => {
            // Client-side validation (example)
            if (!disease.name || !disease.description ) {
                throw new Error("All fields are required and must be in the correct format.");
            }

            console.log('Payload being sent:', disease); // Log payload
            
            const apiUrl = import.meta.env.VITE_API_URL;
            //const response = await fetch('http://localhost:9999/api/diseases', {
            //const response = await fetch('https://emr-backend-intz.onrender.com/api/diseases', {
                const response = await fetch(apiUrl+'api/diseases', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(disease),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log('response:', response);
                console.log('errorData:', errorData);
                throw new Error(errorData.message || "Failed to create patient");
            }

            return response.json();
        },

        onMutate: (newDiseaseInfo: IDiseaseDTO) => {
            queryClient.setQueryData(
                ['diseases'],
                (prevDiseases: IDisease[]) => [
                    ...prevDiseases,
                    {
                        ...newDiseaseInfo,
                        _id: `temp-id-${Date.now()}`, // temporary ID until server responds
                    },
                ] as IDisease[],
            );
        },

        onSettled: () => queryClient.invalidateQueries({ queryKey: ['diseases'] }),

        onSuccess: () => {
            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },

        onError: (error: Error) => {
            console.error("Error creating disease:", error.message);
        },
    });
}
