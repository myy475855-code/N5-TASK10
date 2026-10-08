const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const auth = require("../middleware/auth");
const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, file.fieldname === "logo" ? "uploads/company-logos" : "uploads/student-resumes"),
  filename: (req, file, cb) => cb(null, crypto.randomUUID() + path.extname(file.originalname).toLowerCase())
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = file.fieldname === "logo"
      ? ["image/png","image/jpeg","image/webp"]
      : ["application/pdf"];
    cb(null, allowed.includes(file.mimetype));
  }
});

router.post("/companies/:id/logo", auth, upload.single("logo"), async (req, res, next) => {
  try {
    const company = await prisma.company.findUnique({ where: { id: Number(req.params.id) } });
    if (!company || req.user.role !== "COMPANY" || company.userId !== req.user.id)
      return res.status(403).json({ error: "You can only upload your own company logo" });
    if (!req.file) return res.status(422).json({ error: "Valid PNG, JPEG or WebP logo required" });
    const updated = await prisma.company.update({ where: { id: company.id }, data: { logoPath: req.file.path } });
    res.status(201).json({ logoPath: updated.logoPath });
  } catch (err) { next(err); }
});

router.post("/students/:id/resume", auth, upload.single("resume"), async (req, res, next) => {
  try {
    const student = await prisma.student.findUnique({ where: { id: Number(req.params.id) } });
    if (!student || req.user.role !== "STUDENT" || student.userId !== req.user.id)
      return res.status(403).json({ error: "You can only upload your own resume" });
    if (!req.file) return res.status(422).json({ error: "PDF resume required" });
    const updated = await prisma.student.update({ where: { id: student.id }, data: { resumePath: req.file.path } });
    res.status(201).json({ resumePath: updated.resumePath });
  } catch (err) { next(err); }
});

module.exports = router;