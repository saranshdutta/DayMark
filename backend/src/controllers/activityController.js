const prisma = require("../utils/prisma");

const getActivities = async (req, res, next) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(activities);
  } catch (error) {
    next(error);
  }
};

const getActivityById = async (req, res, next) => {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: req.params.id },
    });
    if (activity) {
      res.json(activity);
    } else {
      res.status(404).json({ success: false, message: "Activity not found" });
    }
  } catch (error) {
    next(error);
  }
};

const createActivity = async (req, res, next) => {
  try {
    const { name, category, unit, icon } = req.body;
    const activity = await prisma.activity.create({
      data: { name, category, unit, icon },
    });
    res.status(201).json(activity);
  } catch (error) {
    next(error);
  }
};

const updateActivity = async (req, res, next) => {
  try {
    const { name, category, unit, icon } = req.body;
    const activity = await prisma.activity.update({
      where: { id: req.params.id },
      data: { name, category, unit, icon },
    });
    res.json(activity);
  } catch (error) {
    next(error);
  }
};

const deleteActivity = async (req, res, next) => {
  try {
    await prisma.activity.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true, message: "Activity deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
};
