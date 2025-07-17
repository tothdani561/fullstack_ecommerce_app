import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    oldPassword: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/, {message: 'Password must contain at least one number'})
    newPassword: string;
}