const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    const { search = "", location = "", category = "", sort = "newest" } = req.query;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));

    const where = {
      ...(location ? { location: { equals: location, mode: "insensitive" } } : {}),
      ...(category ? { category: { equals: category, mode: "insensitive" } } : {}),
      ...(search ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { company: { name: { contains: search, mode: "insensitive" } } }
        ]
      } : {})
    };

    const orderBy = {
      newest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      title_asc: { title: "asc" },
      title_desc: { title: "desc" },
      stipend_desc: { stipend: "desc" },
      stipend_asc: { stipend: "asc" }
    }[sort] || { createdAt: "desc" };

    const [total, data] = await prisma.$transaction([
      prisma.internship.count({ where }),
      prisma.internship.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, title: true, description: true, category: true,
          location: true, workMode: true, stipend: true, duration: true,
          createdAt: true,
          company: { select: { id: true, name: true, location: true, logoPath: true } }
        }
      })
    ]);

    res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

module.exports = router;