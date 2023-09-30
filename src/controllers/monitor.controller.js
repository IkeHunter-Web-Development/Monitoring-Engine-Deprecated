/**
 * @fileoverview API controller for the monitor objects.
 */
const Monitor = require("../models/monitor.model");

module.exports.createMonitor = async (req, res) => {
  let payload = {
    projectId: req.body.projectId || "",
    url: req.body.url || "",
    users: req.body.users || [],
    title: req.body.title || "",
  };

  await Monitor.create(payload)
    .then((monitor) => {
      return res.status(201).json(monitor);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    }); 
};

module.exports.updateMonitor = async (req, res) => {
  const id = req.params.id || req.body._id;

  await Monitor.updateOne({ _id: id }, req.body)
    .then((monitor) => {
      if (!monitor) {
        return res.status(404).json({ message: "Monitor not found" });
      }
    })
    .catch((err) => { 
      console.log(err);
      return res.status(500).json(err);
    });

  let monitor = await Monitor.findOne({ _id: id });

  return res.status(200).json(monitor);
};

module.exports.getMonitor = async (req, res) => {
  const id = req.params.id || "";

  await Monitor.findOne({ _id: id })
    .then((monitor) => {
      if (!monitor) {
        return res.status(404).json({ message: "Monitor not found" });
      }
      return res.status(200).json(monitor);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

module.exports.deleteMonitor = async (req, res) => {
  const id = req.params.id || "";

  await Monitor.deleteOne({ _id: id })
    .then(() => {
      return res.status(200).json({ message: "Monitor deleted" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json(err);
    });
};

module.exports.getMonitors = async (req, res) => {
  await Monitor.find({ active: true })
    .then((monitors) => {
      return res.status(200).json(monitors);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};
