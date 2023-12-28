import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize";
import { IImagesModel } from "./interfaces/IImages";

export const Images = sequelize.define<IImagesModel>(
  "Images",
  {
    imageId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    minerId: {
      type: DataTypes.UUID,
    },

    companyId: {
      type: DataTypes.UUID,
    },

    localURL: {
      type: DataTypes.STRING({ length: 1024 }),
      allowNull: true,
    },

    imageOnlineURL: {
      type: DataTypes.STRING({ length: 1024 }),
      allowNull: true,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
  }
);
