import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IPatient } from "../model/IPatient";

// DELETE hook (delete patient in api)
export function useDeletePatient() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (patientId: string) => {
        const response = await fetch(
          `http://localhost:9999/api/patients/${patientId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      },
      onMutate: (patientId: string) => {
        queryClient.setQueryData<IPatient[]>(["patients"], (prevPatients = []) =>
          prevPatients.filter((patient) => patient._id !== patientId)
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
    });
  }
  