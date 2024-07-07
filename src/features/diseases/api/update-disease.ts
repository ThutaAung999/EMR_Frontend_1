import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IDisease } from "../model/IDisease";

export function useUpdateDisease() {
  const queryClient = useQueryClient();

  const updateDisease = useMutation({
    mutationFn: async (updatedDisease: IDisease) => {
    
      
      //const response = await fetch(`http://localhost:9999/api/diseases/${updatedDisease._id}`, {
      const response = await fetch(`https://emr-backend-intz.onrender.com/api/diseases/${updatedDisease._id}`, {
        method: "PATCH", // or "PUT" if you prefer full update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDisease),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diseases'] });
    },
  });

  return updateDisease;
}


