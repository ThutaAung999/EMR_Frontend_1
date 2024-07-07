import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ITag } from "../model/ITag";

export function useUpdateTag() {
  const queryClient = useQueryClient();

  const updateTag = useMutation({
    mutationFn: async (updatedTag: ITag) => {
      
      //const response = await fetch(`http://localhost:9999/api/tags/${updatedTag._id}`, {
        const response = await fetch(`https://emr-backend-intz.onrender.com/api/tags/${updatedTag._id}`, {
      method: "PATCH", // or "PUT" if you prefer full update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTag),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  return updateTag;
}


