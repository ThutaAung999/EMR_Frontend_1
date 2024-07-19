import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IEmr, IEmrDTO } from "../model/emr.model";

export function useCreateEmr(onSuccessCallback?: () => void) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (emr: IEmrDTO) => {
            // Client-side validation (example)
            if (!emr.notes || 
                !Array.isArray(emr.diseases) || 
                !Array.isArray(emr.medicines) || 
                !Array.isArray(emr.patients)) {
                throw new Error("All fields are required and must be in the correct format.");
            }

            console.log('Payload being sent:', emr); // Log payload

          /*    const apiUrl = import.meta.env.VITE_API_URL;  
            const response = await fetch(apiUrl+'api/emrs', {
           */  
            const response = await fetch('http://localhost:9999/api/emrs', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emr),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log('response:', response);
                console.log('errorData:', errorData);
                throw new Error(errorData.message || "Failed to create emr");
            }

            return response.json();
        },

        //Optimistic update
        //This function is called before the mutation function runs
        onMutate: async (newEmrInfo: IEmrDTO) => {
            
            await queryClient.cancelQueries({ queryKey: ['emrs'] });

            const previousMedicines = queryClient.getQueryData<IEmr[]>(['emr']) ?? [];


            queryClient.setQueryData(
                ['emrs'],
                [
                    {
                        ...newEmrInfo,
                        _id: `temp-id-${Date.now()}`, // temporary ID until server responds
                    },
                    ...previousMedicines,
                ] as IEmr[],
            );
        },

        //This function is called after the mutation function either succeeds or fails.
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['emrs'] }),

        //This function is called if the mutation function succeeds.
        onSuccess: () => {
            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },

        onError: (error: Error) => {
            console.error("Error creating emr:", error.message);
        },
    });
}
