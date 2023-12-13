import { Model } from "sequelize";

export interface IMiner {
  minerId?: string;
  firstName: string;
  lastName: string;
  address?: string;
  phoneNumber?: string;
  companyName?: string;
  companyId?: string;
  jobTitle?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface MinerModelI extends Model<IMiner>, IMiner {}
