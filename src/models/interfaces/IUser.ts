import { Model } from "sequelize";

export interface IUser {
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  isActive?: boolean;
  address?: string;
  role?: string;
  phoneNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserModelI extends Model<IUser>, IUser {}
