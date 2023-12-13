"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create a demo user
    await queryInterface.bulkInsert(
      "User",
      [
        {
          userId: "c7ba68db-c39d-478b-8df9-46be3de7c366",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@miners.com",
          password: await bcrypt.hash("password123", 10),
          isActive: true,
          address: "123 Main St",
          role: "SUPER_ADMIN",
          phoneNumber: "1234567890",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the demo user
    await queryInterface.bulkDelete(
      "User",
      { userId: "c7ba68db-c39d-478b-8df9-46be3de7c366" },
      {}
    );
  },
};
