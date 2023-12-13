import { Model } from "sequelize";

export interface IToken {
  tokenId?: string;
  token: string;
  userId: string;
  type: string;
  expires: Date;
  blacklisted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface TokenModelI extends Model<IToken>, IToken {}
