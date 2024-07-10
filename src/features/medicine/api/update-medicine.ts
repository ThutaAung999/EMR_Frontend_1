import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IMedicine } from "../model/IMedicine";

export function useUpdateMedicine() {
  const queryClient = useQueryClient();

  const updateMedicine = useMutation({
    
    mutationFn: async (updatedMedicine: IMedicine) => {
      const apiUrl = import.meta.env.VITE_API_URL;  
      
      //const response = await fetch(`http://localhost:9999/api/medicines/${updatedMedicine._id}`, {      
      /* const response = await fetch(`https://emr-backend-intz.onrender.com
          /api/medicines/${updatedMedicine._id}`, {
 */
      const response = await fetch(apiUrl+`api/medicines/${updatedMedicine._id}`, {
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

