import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize";
import { TokenModelI } from "./interfaces/IToken";

export const Token = sequelize.define<TokenModelI>(
  "Token",
  {
    tokenId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    token: {
      type: DataTypes.STRING({ length: 1024 }),
      allowNull: true,
    },

    userId: {
      type: DataTypes.UUID,
      references: {
        model: "User",
        key: "userId",
      },
    },

    type: {
      type: DataTypes.STRING,
    },

    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    blacklisted: {
      type: DataTypes.BOOLEAN,
    },

    createdAt: {
      type: DataTypes.DATE,
    },

    updatedAt: {
      type: DataTypes.DATE,
    },

    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);
