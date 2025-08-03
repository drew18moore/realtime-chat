FROM node:18

WORKDIR /usr/src/client

ENV VITE_BASE_URL="http://localhost:8080"

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 4173

RUN npm run build

CMD ["npm", "run", "preview"]