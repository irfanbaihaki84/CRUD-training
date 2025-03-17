const dbPool = require('../config/database');

const getAllUser = () => {
  const SQLQuery = 'SELECT * FROM users WHERE userisactive=1';

  return dbPool.execute(SQLQuery);
};

const getToday = () => {
  const today = new Date();
  let yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  let timeFormat = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
  console.log(timeFormat.format(today));

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  // let newToday = `${dd}/${mm}/${yyyy}-${times}`;
  let newToday = `${today.toLocaleString()}`;
  console.log(newToday);
  return newToday;
};

const createNewUser = (body) => {
  const SQLQuery = `INSERT INTO users (
  usernama,
  useremail,
  userpassword,
  userisactive,
  userisrole,
  usercreated
  )
  VALUES (
  "${body.nama}", 
  "${body.email}", 
  "${body.password}", 
  "${body.isactive}", 
  "${body.isrole}", 
  "${getToday()}"
  )`;

  return dbPool.execute(SQLQuery);
};

const getUser = (idUser) => {
  const SQLQuery = `SELECT * FROM users WHERE iduser="${idUser}"`;

  return dbPool.execute(SQLQuery);
};

const updateUser = (body, idUser) => {
  const SQLQuery = `UPDATE users SET 
    usernama="${body.nama}", 
    useremail="${body.email}", 
    userpassword="${body.password}", 
    userisactive="${body.isactive}", 
    userisrole="${body.isrole}", 
    userupdate="${getToday()}"
    WHERE iduser="${idUser}"`;

  return dbPool.execute(SQLQuery);
};

const isactiveUser = (idUser) => {
  const SQLQuery = `UPDATE users SET 
  userisactive="${0}",
  userupdate="${getToday()}",
  WHERE iduser="${idUser}"`;

  return dbPool.execute(SQLQuery);
};

const deleteUser = (idUser) => {
  const SQLQuery = `DELETE FROM user WHERE iduser=${idUser}`;

  return dbPool.execute(SQLQuery);
};

module.exports = {
  getAllUser,
  createNewUser,
  getUser,
  updateUser,
  isactiveUser,
  deleteUser,
};
