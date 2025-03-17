import { Sequelize } from 'sequelize';

const db = new Sequelize('db_1', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

export default db;
