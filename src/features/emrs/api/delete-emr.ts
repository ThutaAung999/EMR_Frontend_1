import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IEmr } from "../model/emr.model";

// DELETE hook (delete patient in api)
export function useDeleteEmr() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (emrId: string) => {
        const response = await fetch(
          `http://localhost:9999/api/emrs/${emrId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      },
      onMutate: (emrId: string) => {
        queryClient.setQueryData<IEmr[]>(["emrs"], (prevEmrs = []) =>
          prevEmrs.filter((emr) => emr._id !== emrId)
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["emrs"] }),
    });
  }
  