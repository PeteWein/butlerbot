FROM node:12.18.0-slim
# Create the directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot
# Copy and install our bot
COPY package.json /usr/src/bot
RUN npm install
COPY . /usr/src/bot
EXPOSE 80 443
CMD ["npm", "start"]
