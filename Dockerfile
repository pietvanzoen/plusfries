FROM node:alpine
WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm install

COPY . .
RUN npm run build
RUN npm prune --production

RUN mkdir -p /data/

ENV DB_STORAGE /data/plusfries.db
ENV LOG_LEVEL info
ENV PORT 8080

HEALTHCHECK --interval=5m --timeout=3s CMD wget -qO- 0.0.0.0:${PORT}/healthcheck || exit 1
CMD ["npm", "start"]
