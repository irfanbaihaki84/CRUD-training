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

// CREATE
const createNewUser = async (req, res) => {
  console.log(req.body);
  // const bodyPaload = req.body;
  const { body } = req;

  try {
    await UserModel.createNewUser(body);
    res.status(201).json({
      message: 'CREATE new user success.',
      data: body,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

// GET ONE USER ONLY
const getOneUser = async (req, res) => {
  const { idUser } = req.params;

  try {
    const [userhasil] = await UserModel.getUser(idUser);
    res.status(200).json({
      message: 'GET one user success.',
      data: userhasil,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

// PATCH - UPDATE
const patchUser = async (req, res) => {
  // console.log(typeof idUser);
  // let idTest = Number(idUser);
  // console.log(typeof idTest);

  const { idUser } = req.params;
  const { body } = req;

  try {
    await UserModel.updateUser(body, idUser);
    res.status(200).json({
      message: 'PATCH user success.',
      data: {
        id: idUser,
        ...body,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

// DELETE (PATCH ISACTIVE)
const isactiveUpdate = async (req, res) => {
  const { idUser } = req.params;
  console.log(idUser);

  try {
    await UserModel.isactiveUser(idUser);
    res.status(200).json({
      message: 'DELETE user success.',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

// DELETE
const deleteUser = async (req, res) => {
  const { idUser } = req.params;
  console.log(idUser);

  try {
    await UserModel.deleteUser(idUser);
    res.status(200).json({
      message: 'DELETE user success.',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error,
    });
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  getOneUser,
  patchUser,
  isactiveUpdate,
  deleteUser,
};
