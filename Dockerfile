# Use a base image that has Docker installed
FROM docker:latest

# Install any additional dependencies required for your network setup
RUN apk update && apk add --no-cache \
    curl \
    git \
    nodejs \
    npm

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the necessary files into the container
COPY . .

# Run the network setup commands using Docker RUN instructions
RUN cd test-network && \
    ./network.sh up -ca -s couchdb && \
    ./network.sh createChannel -c mychannel && \
    ./network.sh deployCC -ccn basic -ccp asset-transfer-basic/chaincode-javascript/ -ccl javascript && \
    docker pull ipfs/go-ipfs && \
    docker run -d --name my-ipfs-container -v /data/ipfs:/root/.ipfs -p 4001:4001 -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/go-ipfs && \
    cd .. && \
    cd asset-transfer-basic/application-javascript && \
    npm install && \
    npm init && \
    npm i express fabric-network path body-parser fs express-session multer ipfs-api bcrypt fabric-ca-client nodemailer && \
    node -e "require('./org1user').createAdmin(); require('./org2user').createAdmin()"

# Expose necessary ports if needed
EXPOSE 3000

# Start the application (consider using an entrypoint or CMD)
CMD ["node", "index.js"]
