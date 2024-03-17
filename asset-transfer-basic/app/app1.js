'use strict';
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const {buildWallet, buildCCPOrg1 } = require('../../test-application/javascript/AppUtil.js'); // Adjust the path accordingly

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';

const walletPath = path.join(__dirname, 'wallet1');

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}




async function updateLegalRecord(userId , recordId , filename , content ) {
    try {
        const contract = await getContract(userId);
        const wallet = await buildWallet(Wallets, walletPath);
        const userIdentity = await wallet.get(userId);
        const userrole = userIdentity.role;
        const result = await contract.submitTransaction('UpdateLegalRecord', recordId , filename , content ,userrole);
        return result ;
    } finally {
        await disconnectGateway();
    }
}



async function disconnectGateway() {
    // Disconnect the gateway to release resources
    if (gateway) {
        await gateway.disconnect();
    }
}

async function getUserFiles(userId) {
    try {
        const contract = await getContract(userId);
        const result = await contract.evaluateTransaction('GetUserFiles');
        return prettyJSONString(result.toString());
    } finally {
        await disconnectGateway();
    }
}

async function addDocument(userId, recordId, newDocument) {
    try {
        const contract = await getContract(userId);
        const wallet = await buildWallet(Wallets, walletPath);
        const userIdentity = await wallet.get(userId);
        const userrole = userIdentity.role;
        const result = await contract.submitTransaction('AddDocument', recordId, newDocument , userrole);
        return result ;
    } finally {
        await disconnectGateway();
    }
}

async function getAllDocumentKeys(userId, recordId) {
    try {
        const contract = await getContract(userId);
        const result = await contract.evaluateTransaction('GetAllDocumentKeys', recordId);
        return prettyJSONString(result.toString());
    } finally {
        await disconnectGateway();
    }
}

async function getAllLegalRecords(userId) {
    try {
        const contract = await getContract(userId);
        const result = await contract.evaluateTransaction('GetAllLegalRecords');
        return prettyJSONString(result.toString());
    } finally {
        await disconnectGateway();
    }
}

async function getCaseCounts(userId) {
    try {
        const contract = await getContract(userId);

        // Call your chaincode method to get the counts
        const result = await contract.evaluateTransaction('GetLegalRecordCounts');
        return prettyJSONString(result.toString());
    } catch (error) {
        console.error(`Failed to get case counts: ${error}`);
        // You can handle errors here according to your application's needs
        return null;
    } finally {
        await disconnectGateway();
    }
}




let gateway;

async function getContract(userId) {
    try {
        const ccp = buildCCPOrg1();
        const wallet = await buildWallet(Wallets, walletPath);
        gateway = new Gateway();

        await gateway.connect(ccp, {
            wallet,
            identity: userId,
            discovery: { enabled: true, asLocalhost: true },
        });

        const network = await gateway.getNetwork(channelName);
        return network.getContract(chaincodeName);
    } catch (error) {
        console.error(`Failed to get contract: ${error}`);
        await disconnectGateway();
    }
}


module.exports = {
    updateLegalRecord,
    getAllDocumentKeys ,
    getAllLegalRecords,
    addDocument ,
    getUserFiles ,
    getCaseCounts,
}