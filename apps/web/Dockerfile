FROM node:24-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
COPY .env .env
RUN npm run test
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]