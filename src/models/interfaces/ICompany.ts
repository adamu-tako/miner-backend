import { Model } from "sequelize";

export interface ICompany {
  companyId?: string;
  companyName?: string;
  companyType?: string;
  companyAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CompanyModelI extends Model<ICompany>, ICompany {}
