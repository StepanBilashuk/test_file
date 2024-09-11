FROM node

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD sh -c "npx sequelize-cli db:migrate && npm run start:dev"
