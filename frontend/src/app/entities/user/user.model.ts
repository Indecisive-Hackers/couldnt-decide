export interface IUser {
    id : number
    username : string
    password : string
    email_address : string
}

export type NewUser = Omit<IUser, 'id'> & {id: null};