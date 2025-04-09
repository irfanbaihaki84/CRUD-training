const pool = require('../config/db');

exports.logAction = async (
  userId,
  action,
  tableName,
  recordId,
  changes,
  req
) => {
  try {
    await pool.query(`INSERT INTO logs SET ?`, {
      user_id: userId,
      action,
      table_name: tableName,
      record_id: recordId,
      old_value: changes?.oldValue ? JSON.stringify(changes.oldValue) : null,
      new_value: changes?.newValue ? JSON.stringify(changes.newValue) : null,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
    });
  } catch (error) {
    console.error('Error logging action:', error);
  }
};
