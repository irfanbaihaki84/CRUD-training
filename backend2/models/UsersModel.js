import { Sequelize } from 'sequelize';
import db from '../config/database.js';

const { DataTypes } = Sequelize;

const User = db.define(
  'users',
  {
    usernama: DataTypes.STRING(45),
    useremail: DataTypes.STRING(45),
    userpassword: DataTypes.STRING(45),
    userisactive: DataTypes.BOOLEAN,
    userisrole: DataTypes.STRING(45),
    usercreated: DataTypes.STRING(45),
    userupdate: DataTypes.STRING(45),
  },
  {
    freezeTableName: true,
  }
);

export default User;

// (async () => {
//   await db.sync();
// })();
