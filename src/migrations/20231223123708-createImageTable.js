"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Images",
      {
        imageId: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },

        minerId: {
          type: Sequelize.UUID,
        },

        companyId: {
          type: Sequelize.UUID,
        },

        localURL: {
          type: Sequelize.STRING({ length: 1024 }),
          allowNull: true,
        },

        imageOnlineURL: {
          type: Sequelize.STRING({ length: 1024 }),
          allowNull: true,
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: Sequelize.DATE,
          defaultValue: null,
        },
      },
      {
        paranoid: true,
        freezeTableName: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Images");
  },
};
