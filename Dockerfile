FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN bun install --production
COPY . .
CMD ["bun", "start"]
