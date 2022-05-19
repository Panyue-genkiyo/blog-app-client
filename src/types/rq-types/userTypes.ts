import { tokenAndDispatch } from "../Typescript";
import { IUser } from "../Typescript";

export interface updateUserParamsType extends tokenAndDispatch{
    user: IUser,
    name: string,
    avatar: File,
    page: number,
}

export interface resetPasswordParamsType extends tokenAndDispatch{
    password: string,
    cf_password: string,
}
