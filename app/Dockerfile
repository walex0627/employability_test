FROM node:20-alpine

WORKDIR /usr/src/app

# Since context is ./app, we just copy package.json directly
COPY package*.json ./

RUN npm install

# Copy all files from the current directory (which is app/) to the container
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]