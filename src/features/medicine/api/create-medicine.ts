
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IMedicine } from "../model/IMedicine";

import { IMedicineDTO } from "../model/IMedicine";

export function useCreateMedicine(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (medicine: IMedicineDTO) => {

      //Validations are here
      if (!medicine.name || !medicine.manufacturer || !Array.isArray(medicine.diseases) ) {
        throw new Error("All fields are required and must be in the correct format.");
    }
      
    //const response = await fetch("https://emr-backend-intz.onrender.com/api/medicines", {
  
    const apiUrl = import.meta.env.VITE_API_URL;  
    const response = await fetch(apiUrl+"api/medicines", {
                            
    //const response = await fetch(`http://localhost:9999/api/medicines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicine),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("response:", response);
        console.log("errorData:", errorData);
        throw new Error(errorData.message);
      }
      return response.json();
    },


    onMutate: async (newMedicineInfo: IMedicineDTO) => {

      await queryClient.cancelQueries({ queryKey: ['medicines'] });


      const previousMedicines = queryClient.getQueryData<IMedicine[]>(['medicine']) ?? [];

      queryClient.setQueryData(
        ["medicines"],                
          [        
            {
              ...newMedicineInfo,
              _id: `temp-id-${Date.now()}`, // temporary ID until server responds
            },
            ...previousMedicines,
          ] as IMedicine[]
      );
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: ["medicines"] }),

    onSuccess: () => {
      if (onSuccessCallback) {
        onSuccessCallback();
      }
      /*       navigate("/medicines"); */
    },

    onError: (error: Error) => {
      console.error("Error creating patient:", error.message);
    },
  });
}
