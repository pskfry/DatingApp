import { User } from './User';

export interface Photo {
    id: number;
    url: string;
    isMainPhoto: boolean;
    description: string;
    dateAdded: Date;
    user?: User;
    userId: number;
}
