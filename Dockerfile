FROM node:20-alpine

WORKDIR /app

# Устанавливаем OpenCode глобально
RUN npm install -g opencode-ai@latest

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4096

CMD ["node", "index.js"]
