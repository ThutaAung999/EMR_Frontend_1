
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IPatientDTO } from "../model/IPatient";

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  const updatePatient = useMutation({
    mutationFn: async (updatedPatient: IPatientDTO) => {

        
      
      const response = await fetch(`http://localhost:9999/api/patients/${updatedPatient._id}`, {
      //const response = await fetch(`https://emr-backend-intz.onrender.com/api/patients/${updatedPatient._id}`, {

      /*
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(apiUrl+`api/patients/${updatedPatient._id}`, { 
     */

        method: "PATCH", // or "PUT" if you prefer full update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPatient),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });

  return updatePatient;
}

