import { useMutation } from "@tanstack/react-query";
import { subscribeToNewsletter } from "./newLetterService";

export const useNewsletter = () => {
    return useMutation({ mutationFn: subscribeToNewsletter });
};