"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "User",
      {
        userId: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        address: {
          type: Sequelize.STRING,
        },
        role: {
          type: Sequelize.ENUM("SUPER_ADMIN", "ADMIN", "USER"),
          allowNull: false,
          defaultValue: "USER",
        },
        phoneNumber: {
          type: Sequelize.STRING,
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
    await queryInterface.createTable("Token", {
      tokenId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      token: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: "User",
          key: "userId",
        },
      },
      type: {
        type: Sequelize.STRING,
      },
      expires: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      blacklisted: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("User");
    await queryInterface.dropTable("Token");
  },
};
