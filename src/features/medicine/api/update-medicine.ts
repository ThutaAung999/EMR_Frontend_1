import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IMedicine } from "../model/IMedicine";

export function useUpdateMedicine() {
  const queryClient = useQueryClient();

  const updateMedicine = useMutation({
    mutationFn: async (updatedMedicine: IMedicine) => {
      const response = await fetch(`http://localhost:9999/api/medicines/${updatedMedicine._id}`, {
        method: "PATCH", // or "PUT" if you prefer full update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMedicine),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });

  return updateMedicine;
}

