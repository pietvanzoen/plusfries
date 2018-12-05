FROM node:alpine
WORKDIR /app
COPY ./package.json ./package-lock.json ./

ENV NODE_ENV production
RUN npm install

COPY . .

ENV DB_STORAGE /data/plusfries.db
RUN mkdir -p /data/
ENV PORT 8080
CMD ["npm", "start"]
