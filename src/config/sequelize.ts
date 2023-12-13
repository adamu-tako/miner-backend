import { Sequelize } from "sequelize";

const sequelize = new Sequelize("miners_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const sequelizeTr = async () => await sequelize.transaction();

export { sequelize, sequelizeTr };
