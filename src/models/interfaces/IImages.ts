import { Model } from "sequelize";

export interface IImages {
  imageId?: string;
  minerId?: string;
  companyId?: string;
  localURL?: string;
  imageOnlineURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IImagesModel extends Model<IImages>, IImages {}
