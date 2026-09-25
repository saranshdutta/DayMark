const prisma = require("../utils/prisma");

const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user) {
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          name: name || user.name,
          email: email || user.email,
          avatar: avatar !== undefined ? avatar : user.avatar,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
        },
      });

      res.json(updatedUser);
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
