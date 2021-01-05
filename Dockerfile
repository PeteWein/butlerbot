FROM node:12.18.0-slim
# Add myself as maintainer of image
LABEL maintainer="https://github.com/PeteWein"
# Create the directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot
# Copy and install our bot
COPY package.json /usr/src/bot
RUN npm install
COPY . /usr/src/bot
EXPOSE 80 443
CMD ["npm", "start"]
