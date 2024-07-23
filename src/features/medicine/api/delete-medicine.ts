import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IMedicine } from "../model/IMedicine";

// DELETE hook (delete patient in api)
export function useDeleteMedicine() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (medicineId: string) => {        
        
          //`https://emr-backend-intz.onrender.com/api/medicines/${medicineId}`,
          
          const apiUrl = import.meta.env.VITE_API_URL;   
          const response = await fetch(apiUrl+`api/medicines/${medicineId}`,
            
        //const response = await fetch(`http://localhost:9999/api/medicines/${medicineId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      },
      onMutate: (medicineId: string) => {
        queryClient.setQueryData<IMedicine[]>(["medicines"], (prevMedicines = []) =>
          prevMedicines.filter((medicine) => medicine._id !== medicineId)
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["medicines"] }),
    });
  }
  

