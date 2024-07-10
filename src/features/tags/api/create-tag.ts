import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ITag, ITagDTO } from "../model/ITag";

export function useCreateTag(onSuccessCallback?: () => void) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (tag: ITagDTO) => {
            // Client-side validation (example)
            if (!tag.name ) {
                throw new Error("All fields are required and must be in the correct format.");
            }

            console.log('Payload being sent:', tag); // Log payload

            const apiUrl = import.meta.env.VITE_API_URL;  
            //const response = await fetch('http://localhost:9999/api/tags', {
                //const response = await fetch('https://emr-backend-intz.onrender.com/api/tags', {
                const response = await fetch(apiUrl+'api/tags', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tag),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log('response:', response);
                console.log('errorData:', errorData);
                throw new Error(errorData.message || "Failed to create tag");
            }

            return response.json();
        },

        onMutate: (newTagInfo: ITagDTO) => {
            queryClient.setQueryData(
                ['tags'],
                (prevTags: ITag[]) => [
                    ...prevTags,
                    {
                        ...newTagInfo,
                        _id: `temp-id-${Date.now()}`, // temporary ID until server responds
                    },
                ] as ITag[],
            );
        },

        onSettled: () => queryClient.invalidateQueries({ queryKey: ['tags'] }),

        onSuccess: () => {
            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },

        onError: (error: Error) => {
            console.error("Error creating tag:", error.message);
        },
    });
}
