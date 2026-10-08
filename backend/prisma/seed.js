const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const cities = ["Lahore","Islamabad","Rawalpindi","Karachi","Faisalabad","Peshawar","Multan","Gujranwala","Sialkot","Remote"];
const categories = ["Software Development","Web Development","Data Science","AI & Machine Learning","Cybersecurity","UI/UX Design","Cloud & DevOps","Mobile Development","QA & Testing","Business Analytics"];
const titles = ["Software Engineer Intern","Frontend Developer Intern","Backend Developer Intern","Data Analyst Intern","AI Engineer Intern","Cybersecurity Intern","UI/UX Designer Intern","DevOps Intern","Mobile App Intern","QA Engineer Intern"];

async function main() {
  await prisma.internship.deleteMany();
  await prisma.student.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  for (let i = 1; i <= 25; i++) {
    const user = await prisma.user.create({
      data: { email: `company${i}@example.com`, name: `Company User ${i}`, role: "COMPANY" }
    });
    await prisma.company.create({
      data: { userId: user.id, name: `${["Tech","Digital","Systems","Soft","Cloud"][i % 5]} Pakistan ${i}`, location: cities[i % cities.length] }
    });
  }

  const studentUser = await prisma.user.create({
    data: { email: "student@example.com", name: "Demo Student", role: "STUDENT" }
  });
  await prisma.student.create({
    data: { userId: studentUser.id, university: "University of Computer Science" }
  });

  const companies = await prisma.company.findMany();
  const rows = [];
  for (let i = 0; i < 240; i++) {
    rows.push({
      title: titles[i % titles.length],
      description: `Practical internship opportunity ${i + 1} involving real-world development, teamwork and professional engineering practices.`,
      category: categories[i % categories.length],
      location: cities[i % cities.length],
      workMode: i % 3 === 0 ? "Remote" : i % 3 === 1 ? "Hybrid" : "On-site",
      stipend: 10000 + (i % 10) * 5000,
      duration: `${2 + (i % 5)} months`,
      companyId: companies[i % companies.length].id
    });
  }
  await prisma.internship.createMany({ data: rows });
  console.log("Seeded 240 internships, 25 companies and 1 student.");
}

main().finally(() => prisma.$disconnect());