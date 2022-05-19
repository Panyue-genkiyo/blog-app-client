import { IUser } from '../Typescript'

export interface IAuth  {
    msg?:string
    access_token?: string,
    user?: IUser
}

