FROM node:alpine
WORKDIR /app
COPY ./package.json ./package-lock.json ./

ENV NODE_ENV production
RUN npm install

COPY . .

ENV DB_STORAGE /data/plusfries.db
RUN adduser -S plusfries
RUN mkdir -p /data/ && chown -R plusfries /data
USER plusfries

ENV PORT 8080
CMD ["npm", "start"]
