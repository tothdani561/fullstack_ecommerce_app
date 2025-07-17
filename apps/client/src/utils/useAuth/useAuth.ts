import { useMutation } from "@tanstack/react-query";
import { registerUser, RegisterUserData } from "./authService";

export const useRegister = () => {
    return useMutation({
        mutationFn: (userData: RegisterUserData) => registerUser(userData),
    });
};