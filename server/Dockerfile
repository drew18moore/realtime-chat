FROM node:18

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]