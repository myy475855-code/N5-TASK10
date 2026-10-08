FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
RUN mkdir -p uploads/company-logos uploads/student-resumes
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]