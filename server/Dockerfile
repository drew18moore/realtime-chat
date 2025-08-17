FROM node:22

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["sh", "-c", "npm run migrate && npm start"]