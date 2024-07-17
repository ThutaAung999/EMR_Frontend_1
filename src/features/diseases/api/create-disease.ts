/* import { useMutation, useQueryClient } from "@tanstack/react-query";
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

        onMutate: async (newDiseaseInfo: IDiseaseDTO) => {

            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ['diseases'] });

            // Snapshot the previous value
            const previousDiseases = queryClient.getQueryData<IDisease[]>(['diseases']) ??[];

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
            // Return a context with the previous and new disease
            return { previousDiseases };
        },

        onSettled: () => queryClient.invalidateQueries({ queryKey: ['diseases'] }),

        onSuccess: () => {
            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },

        onError: (error: Error , newDiseaseInfo: IDiseaseDTO, context?: { previousDiseases: IDisease[] }) => {
            console.log("New Disease Info: " + JSON.stringify(newDiseaseInfo));
            console.error("Error creating disease:", error.message);

            if(context?.previousDiseases){
                queryClient.setQueryData(['diseases'],context.previousDiseases)
            }
        },
    });
}
 */


//updated version
/* 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IDisease, IDiseaseDTO } from "../model/IDisease";

export function useCreateDisease(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (disease: IDiseaseDTO) => {
      // Client-side validation
      if (!disease.name || !disease.description ) {
        throw new Error("All fields are required and must be in the correct format.");
      }

      console.log('Payload being sent:', disease); // Log payload
      
      const response = await fetch('http://localhost:9999/api/diseases', {
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
        throw new Error(errorData.message || "Failed to create disease");
      }

      return response.json();
    },

    onMutate: async (newDiseaseInfo: IDiseaseDTO) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['diseases'] });

      // Snapshot the previous value
      const previousDiseases = queryClient.getQueryData<IDisease[]>(['diseases']) ??[];

      // Optimistically update to the new value
      queryClient.setQueryData(
        ['diseases'],
        (prevDiseases: IDisease[]=[]) => [
          {
            ...newDiseaseInfo,
            _id: `temp-id-${Date.now()}`, // temporary ID until server responds
          },
          ...prevDiseases,
        ] as IDisease[],
      );

      // Return a context with the previous and new disease
      return { previousDiseases };
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: ['diseases'] }),

    onSuccess: () => {
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },

    onError: (error: Error, newDiseaseInfo: IDiseaseDTO, context?: { previousDiseases: IDisease[] }) => {
      console.log("New Disease Info: " + JSON.stringify(newDiseaseInfo));
      console.error("Error creating disease:", error.message);

      if (context?.previousDiseases) {
        queryClient.setQueryData(['diseases'], context.previousDiseases);
      }
    },
  });
}
 */

//updated version 2
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IDisease, IDiseaseDTO } from "../model/IDisease";

export function useCreateDisease(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (disease: IDiseaseDTO) => {
      if (!disease.name || !disease.description ) {
        throw new Error("All fields are required and must be in the correct format.");
      }

      /* const apiUrl = import.meta.env.VITE_API_URL;  
      const response = await fetch(apiUrl+'api/diseases', { */
      const response = await fetch('http://localhost:9999/api/diseases', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(disease),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create disease");
      }

      return response.json();
    },

    onMutate: async (newDiseaseInfo: IDiseaseDTO) => {
      await queryClient.cancelQueries({ queryKey: ['diseases'] });

      const previousDiseases = queryClient.getQueryData<IDisease[]>(['diseases']) ?? [];

      queryClient.setQueryData(
        ['diseases'],
        [
          {
            ...newDiseaseInfo,
            _id: `temp-id-${Date.now()}`, 
          },
          ...previousDiseases,
        ] as IDisease[],
      );

      return { previousDiseases };
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: ['diseases'] }),

    onSuccess: () => {
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },

    onError: (error: Error, newDiseaseInfo: IDiseaseDTO, context?: { previousDiseases: IDisease[] }) => {
        console.log("New Disease Info: " + JSON.stringify(newDiseaseInfo));
        console.error("Error creating disease:", error.message);
  
        if (context?.previousDiseases) {
          queryClient.setQueryData(['diseases'], context.previousDiseases);
        }
      },
    });
  }