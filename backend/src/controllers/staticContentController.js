const {
  createAchiever,
  createCustomAchieverExam,
  createCustomExamAchiever,
  createHotLink,
  deleteCustomAchieverExam,
  deleteAchiever,
  deleteHotLink,
  getAchiever,
  getHotLink,
  listAchievers,
  listAchieverCategoryCounts,
  listCustomAchieverExams,
  listHotLinks,
  listTopAchievers,
  reorderHotLinks,
  toggleHotLink,
  updateAchiever,
  updateHotLink,
} = require("../models/staticContentModel");

async function getAdminHotLinks(_req, res, next) {
  try {
    return res.json({ success: true, data: await listHotLinks() });
  } catch (error) {
    return next(error);
  }
}

async function getPublicHotLinks(_req, res, next) {
  try {
    return res.json({ success: true, data: await listHotLinks({ activeOnly: true }) });
  } catch (error) {
    return next(error);
  }
}

async function getAdminHotLink(req, res, next) {
  try {
    const link = await getHotLink(req.params.id);
    if (!link) return res.status(404).json({ success: false, message: "Hot link not found." });
    return res.json({ success: true, data: link });
  } catch (error) {
    return next(error);
  }
}

async function addAdminHotLink(req, res, next) {
  try {
    const link = await createHotLink(req.body);
    if (!link) throw new Error("Hot link was saved, but could not be retrieved.");
    return res.status(201).json({ success: true, message: "Hot link created successfully.", data: link });
  } catch (error) {
    return next(error);
  }
}

async function editAdminHotLink(req, res, next) {
  try {
    const link = await updateHotLink(req.params.id, req.body);
    if (!link) return res.status(404).json({ success: false, message: "Hot link not found." });
    return res.json({ success: true, message: "Hot link updated successfully.", data: link });
  } catch (error) {
    return next(error);
  }
}

async function removeAdminHotLink(req, res, next) {
  try {
    const deleted = await deleteHotLink(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Hot link not found." });
    return res.json({ success: true, message: "Hot link deleted successfully." });
  } catch (error) {
    return next(error);
  }
}

async function changeAdminHotLinkStatus(req, res, next) {
  try {
    const link = await toggleHotLink(req.params.id, req.body?.isActive);
    if (!link) return res.status(404).json({ success: false, message: "Hot link not found." });
    return res.json({ success: true, message: "Hot link status updated successfully.", data: link });
  } catch (error) {
    return next(error);
  }
}

async function changeAdminHotLinkOrder(req, res, next) {
  try {
    const links = await reorderHotLinks(req.body?.items);
    return res.json({ success: true, message: "Hot links reordered successfully.", data: links });
  } catch (error) {
    return next(error);
  }
}

async function getAdminAchievers(_req, res, next) {
  try {
    return res.json({ success: true, data: await listAchievers() });
  } catch (error) {
    return next(error);
  }
}

async function getAdminAchieverCategoryCounts(_req, res, next) {
  try {
    return res.json({ success: true, data: await listAchieverCategoryCounts() });
  } catch (error) {
    return next(error);
  }
}

async function getAdminAchieverExams(_req, res, next) {
  try {
    return res.json({ success: true, data: await listCustomAchieverExams() });
  } catch (error) {
    return next(error);
  }
}

async function getPublicAchieverExams(_req, res, next) {
  try {
    return res.json({ success: true, data: await listCustomAchieverExams() });
  } catch (error) {
    return next(error);
  }
}

async function addAdminAchieverExam(req, res, next) {
  try {
    const exam = await createCustomAchieverExam(req.body);
    if (!exam) throw new Error("Exam was saved, but could not be retrieved.");
    return res.status(201).json({ success: true, message: "Exam added successfully.", data: exam });
  } catch (error) {
    return next(error);
  }
}

async function removeAdminAchieverExam(req, res, next) {
  try {
    const deleted = await deleteCustomAchieverExam(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Exam not found." });
    return res.json({ success: true, message: "Exam and its achiever records deleted successfully." });
  } catch (error) {
    return next(error);
  }
}

async function addAdminCustomExamAchiever(req, res, next) {
  try {
    const achiever = await createCustomExamAchiever(req.params.id, req.body);
    if (!achiever) return res.status(404).json({ success: false, message: "Exam not found." });
    return res.status(201).json({ success: true, message: "Achiever added successfully.", data: achiever });
  } catch (error) {
    return next(error);
  }
}

async function getAdminTopAchievers(req, res, next) {
  try {
    const data = await listTopAchievers({
      category: req.query.category,
      year: req.query.year,
      studentClass: req.query.class,
      limit: req.query.limit,
    });
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function getPublicAchievers(req, res, next) {
  try {
    const data = await listTopAchievers({
      category: req.query.category || "nstse-offline",
      year: req.query.year || "",
      studentClass: req.query.class || "",
      limit: req.query.limit || "all",
    });
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
}

async function addAdminAchiever(req, res, next) {
  try {
    const achiever = await createAchiever(req.body);
    if (!achiever) throw new Error("Achiever was saved, but could not be retrieved.");
    return res.status(201).json({ success: true, message: "Achiever added successfully.", data: achiever });
  } catch (error) {
    return next(error);
  }
}

async function editAdminAchiever(req, res, next) {
  try {
    const achiever = await updateAchiever(req.params.id, req.body);
    if (!achiever) return res.status(404).json({ success: false, message: "Achiever not found." });
    return res.json({ success: true, message: "Achiever updated successfully.", data: achiever });
  } catch (error) {
    return next(error);
  }
}

async function removeAdminAchiever(req, res, next) {
  try {
    const deleted = await deleteAchiever(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Achiever not found." });
    return res.json({ success: true, message: "Achiever deleted successfully." });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  addAdminAchiever,
  addAdminAchieverExam,
  addAdminCustomExamAchiever,
  addAdminHotLink,
  removeAdminAchieverExam,
  changeAdminHotLinkOrder,
  changeAdminHotLinkStatus,
  editAdminAchiever,
  editAdminHotLink,
  getAdminAchievers,
  getAdminAchieverCategoryCounts,
  getAdminAchieverExams,
  getAdminHotLink,
  getAdminHotLinks,
  getAdminTopAchievers,
  getPublicAchievers,
  getPublicAchieverExams,
  getPublicHotLinks,
  removeAdminAchiever,
  removeAdminHotLink,
};
