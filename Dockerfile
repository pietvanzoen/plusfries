FROM node:alpine
WORKDIR /app
COPY ./package.json ./package-lock.json ./

ENV NODE_ENV production
ENV PLSFRSURL 'https://plusfries.piet.me'
RUN npm install
RUN npm build

COPY . .

ENV DB_STORAGE /data/plusfries.db
RUN mkdir -p /data/

ENV PORT 8080
HEALTHCHECK --interval=5m --timeout=3s CMD wget -qO- 0.0.0.0:${PORT}/healthcheck || exit 1
CMD ["npm", "start"]
