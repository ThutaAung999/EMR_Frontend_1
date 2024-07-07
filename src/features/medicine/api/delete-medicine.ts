import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IMedicine } from "../model/IMedicine";

// DELETE hook (delete patient in api)
export function useDeleteMedicine() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (medicineId: string) => {
        const response = await fetch(
          
          //`http://localhost:9999/api/medicines/${medicineId}`,
          `https://emr-backend-intz.onrender.com/api/medicines/${medicineId}`,
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
  