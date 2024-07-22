import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IEmr } from "../model/emr.model";

export function useDeleteEmr() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (emrId: string) => {
      //  const apiUrl = import.meta.env.VITE_API_URL;  
        const response = await fetch(
          
          `http://localhost:9999/api/emrs/${emrId}`,
          //`https://emr-backend-intz.onrender.com/api/emrs/${emrId}`,
       
          //  apiUrl+`api/emrs/${emrId}`,
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
  