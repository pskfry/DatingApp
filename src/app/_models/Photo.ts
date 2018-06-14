import { User } from './User';

export interface Photo {
    Id: number;
    Url: string;
    isMainPhoto: boolean;
    Description: string;
    DateAdded: Date;
    User: User;
    UserId: number;
}
