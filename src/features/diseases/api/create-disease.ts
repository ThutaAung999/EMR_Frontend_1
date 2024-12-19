import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IDisease, IDiseaseDTO } from "../model/IDisease";

export function useCreateDisease(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (disease: IDiseaseDTO) => {
      if (!disease.name || !disease.description) {
        throw new Error(
          "All fields are required and must be in the correct format."
        );
      }

      // const apiUrl = import.meta.env.VITE_API_URL;
      // const response = await fetch(apiUrl+'api/diseases', {
      const response = await fetch("http://localhost:9999/api/diseases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(disease),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create disease");
      }

      return response.json();
    },

    onMutate: async (newDiseaseInfo: IDiseaseDTO) => {
      await queryClient.cancelQueries({ queryKey: ["diseases"] });

      const previousDiseases =
        queryClient.getQueryData<IDisease[]>(["diseases"]) ?? [];

      queryClient.setQueryData(["diseases"], [
        {
          ...newDiseaseInfo,
          _id: `temp-id-${Date.now()}`,
        },
        ...previousDiseases,
      ] as IDisease[]);

      return { previousDiseases };
    },

    onSuccess: (newDisease) => {
      queryClient.setQueryData(
        ["diseases"],
        (oldData: IDisease[] | undefined) => {
          if (!oldData) return [newDisease];

          return [newDisease, ...oldData];
        }
      );

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: ["diseases"] }),

    onError: (
      error: Error,
      newDiseaseInfo: IDiseaseDTO,
      context?: { previousDiseases: IDisease[] }
    ) => {
      console.log("New Disease Info: " + JSON.stringify(newDiseaseInfo));
      console.error("Error creating disease:", error.message);

      if (context?.previousDiseases) {
        queryClient.setQueryData(["diseases"], context.previousDiseases);
      }
    },
  });
}
