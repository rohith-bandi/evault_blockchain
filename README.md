# Blockchain-based eVault for Legal Records
----------------------------------------------


Introduction
---------
This project aims to develop a `blockchain-based` eVault system for legal records, leveraging `Hyperledger` technology. The system ensures security, transparency, and accessibility for all stakeholders involved in legal proceedings. It allows for `storing`, `managing`, and `sharing` legal records securely and efficiently while integrating with existing legal databases and case management systems.


## Features
---------
- **Smart Contracts** : Manages access, permissions, and transactions securely.
  
- **User-friendly Interfaces** : Provides intuitive interfaces for lawyers, judges, clients, and other stakeholders.
 
- **IPFS Network** : Allows uploading, retrieval, tracking changes, and sharing legal documents.
  
- **Privacy and Confidentiality** : Ensures data privacy through access controls, encryption, and authentication mechanisms.
  
- **Integration** : Seamlessly integrates with existing legal databases and case management systems.


## Tech Stack

**Client :**  HTML , CSS , JavaScript

**Server :**  Node, Express

**Blockchain :**  Hyperledger Fabric

**Database :** CouchDB

**File Storage** : InterPlanetary File System - IPFS

**Authentication :**  Digital signature

## Pre requisites :
- Git
- Curl
- Node
- Couchdb
- Ipfs
- Docker and Docker-compose

## Installation of Hyperledger Fabric

- Hyperledger fabric is more compatible with Linux . So I used Linux Ubuntu OS . Run this command to install hyperledger fabric .

```bash
  curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh

```

- Sometimes the link may not work in some devices for that you have to open the link in other devices and copy the script . Then run the script in your device . For running script file :

```bash
  chmod +x filename.sh

  ./filename.sh
```

## Connecting the CouchDB :

- Change the configuration of all core.yaml files from LevelDB to CouchDB. 

- In test-network directory , change the Database option to couchdb in network.config file .

## Starting the fabric-network :
```bash
cd path/to/fabric-samples/test-network

./network.sh down

sudo ./network.sh up -s couchdb

sudo ./network.sh createChannel -c mychannel 

sudo ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript -ccl javascript
```

## IPFS Network:
- Commands for installation of ipfs network :
```bash
curl -LO https://dist.ipfs.io/go-ipfs/v0.11.0/go-ipfs_v0.11.0_linux-amd64.tar.gz
tar xvfz go-ipfs_v0.11.0_linux-amd64.tar.gz
cd go-ipfs
sudo bash install.sh 
ipfs init
ipfs daemon
```
- Command for converting pdf to hash : 
```bash
ipfs add path/to/file
```
- Command for retriving the file from hash :
```bash
ipfs get path/to/file
```
- Command to extract content from hash :
```bash
ipfs cat path/to/file
```

## Deploying the Application :

Before starting the application , you have to setup the folders like  application-javascript , chaincode-javascript , test-application . `If you clone this respiratory , Then you can just start from fabric-network` . Modify the files as per your requirements . In application-javascript run this commands :
```bash
  npm init
  npm i 
  npm start
```

## Web-Interfaces for admin :
### Portainer :  127.0.0.1:9000
- Commands to install docker interface portainer :
```bash
docker volume create portainer_data
docker run -d -p 9000:9000 -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data --name portainer portainer/portainer 
```
### CouchDB   :  127.0.0.1:5984 
- Automatically installed  using docker during up the network and couchdb containers also will get into the docker . Defaultly username is admin and password is adminpw .

### Hyperledger Explorer : 127.0.0.1:8081
- Commands to install : 
```bash
cd path/to/fabric/fabric-samples/token-sdk/explorer
docker-compose down -v
docker-compose up -d
```
- Note : Username is exploreradmin and password is exploreradminpw . Before installation , make required changes in the connection-profile .

### Hyperledger Explorer Database : http://localhost/adminer.php
- Commands to install  php-pgsql and adminer :
```bash
sudo apt-get update
sudo apt-get install php php-pgsql
wget https://github.com/vrana/adminer/releases/download/v4.8.1/adminer-4.8.1.php -O adminer.php
sudo mv adminer.php /var/www/html/adminer.php
sudo apt-get install apache2
```
- Note : For server address , go to docker interface and see ip address . Username is hppoc , password is password , database is fabricexplorer and system is postgresql . 


## Acknowledgements

 - [Hyperledger Documentation ](https://hyperledger-fabric.readthedocs.io/en/release-2.5/)



## 🔗 Link

 - [ Project UI Link ](https://evault-61qg.onrender.com)
