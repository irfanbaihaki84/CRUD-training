const datas = require('../src/data.js');

const getAllUsers = async (req, res) => {
  //   console.log('data: ', datas);

  try {
    res.status(200).json({
      message: 'GET dummy data success.',
      data: datas.users,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
module.exports = { getAllUsers };
