import { useQuery } from "@tanstack/react-query";
import { ITag } from "../model/ITag";

// Fetch diseases
const fetchTags = async (): Promise<ITag[]> => {
  const response = await fetch("http://localhost:9999/api/tags");
  if (!response.ok) {
    throw new Error("Failed to fetch tags");
  }
  return response.json();
};

export  const useGetTags = () => {
    return useQuery<ITag[], Error>({
        queryKey: ['tags'],
        queryFn: fetchTags,
        refetchOnWindowFocus: false,
    });
};

