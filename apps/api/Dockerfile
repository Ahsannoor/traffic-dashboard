FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm run test
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/main.js"]