import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ITag } from "../model/ITag";

export function useDeleteTag() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (tagId: string) => {
        const response = await fetch(
          `http://localhost:9999/api/tags/${tagId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Error occurred while deleting the tag");
        }
        return response.json();
      },
      onMutate: (tagId: string) => {
        queryClient.setQueryData<ITag[]>(["tags"], (prevTags = []) =>
          prevTags.filter((tag) => tag._id !== tagId)
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
    });
  }
  