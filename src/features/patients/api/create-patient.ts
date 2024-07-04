import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IPatient, IPatientDTO } from "../model/IPatient";

export function useCreatePatient(onSuccessCallback?: () => void) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (patient: IPatientDTO) => {
            // Client-side validation (example)
            if (!patient.name || !patient.age || !Array.isArray(patient.diseases) || !Array.isArray(patient.doctors)) {
                throw new Error("All fields are required and must be in the correct format.");
            }

            console.log('Payload being sent:', patient); // Log payload

            const response = await fetch('http://localhost:9999/api/patients', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patient),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log('response:', response);
                console.log('errorData:', errorData);
                throw new Error(errorData.message || "Failed to create patient");
            }

            return response.json();
        },

        onMutate: (newPatientInfo: IPatientDTO) => {
            queryClient.setQueryData(
                ['patients'],
                (prevPatients: IPatient[]) => [
                    ...prevPatients,
                    {
                        ...newPatientInfo,
                        _id: `temp-id-${Date.now()}`, // temporary ID until server responds
                    },
                ] as IPatient[],
            );
        },

        onSettled: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),

        onSuccess: () => {
            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },

        onError: (error: Error) => {
            console.error("Error creating patient:", error.message);
        },
    });
}
