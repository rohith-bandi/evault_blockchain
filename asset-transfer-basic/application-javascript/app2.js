'use strict';
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const {buildWallet, buildCCPOrg2 } = require('../../test-application/javascript/AppUtil.js'); // Adjust the path accordingly

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';

const walletPath1 = path.join(__dirname, 'wallet1');
const walletPath2 = path.join(__dirname, 'wallet2');

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function createLegalRecord( userId , recordId , files ) {
    try {
        const contract = await getContract(userId);
        const wallet2 = await buildWallet(Wallets, walletPath2);
        const userIdentity = await wallet2.get(userId);
        const userrole = userIdentity.role;
        const result = await contract.submitTransaction('CreateLegalRecord', recordId , files , userrole);
        return result;
    } finally {
        await disconnectGateway();
    }
}

async function updateLegalRecord(userId , recordId , filename , content ) {
    try {
        const contract = await getContract(userId);
        const wallet2 = await buildWallet(Wallets, walletPath2);
        const userIdentity = await wallet2.get(userId);
        const userrole = userIdentity.role;
        const result = await contract.submitTransaction('UpdateLegalRecord', recordId , filename , content , userrole);
        return result;
    } finally {
        await disconnectGateway();
    }
}

async function grantAccessToLegalRecord(userId , recordId , newUser) {
    try {
        const contract = await getContract(userId);
        const wallet1 = await buildWallet(Wallets, walletPath1);
        const wallet2 = await buildWallet(Wallets, walletPath2);
        // Check if the user exists in the wallet
        const userIdentity1 = await wallet1.get(newUser);
        const userIdentity2 = await wallet2.get(newUser);

        if (!userIdentity1 && !userIdentity2) {
           return `User ${newUser} not found`;
        }
        let userrole ;
        if(userIdentity1){
            userrole = userIdentity1.role;
        }
        else{
            userrole = userIdentity2.role;
        }

        // Submit the transaction to grant access
        const result = await contract.submitTransaction('GrantAccess', recordId, newUser ,userrole);
        return result ;
    } finally {
        await disconnectGateway();
    }
}


async function revokeAccessToLegalRecord(userId , recordId , userToRevoke) {
    try {
        const contract = await getContract(userId);
        const wallet1 = await buildWallet(Wallets, walletPath1);
        const wallet2 = await buildWallet(Wallets, walletPath2);
        // Check if the user exists in the wallet
        const userIdentity1 = await wallet1.get(userToRevoke);
        const userIdentity2 = await wallet2.get(userToRevoke);

        if (!userIdentity1 && !userIdentity2) {
            return `User ${userToRevoke} not found`;
        }

        let userrole ;
        if(userIdentity1){
            userrole = userIdentity1.role;
        }
        else{
            userrole = userIdentity2.role;
        }

        const result = await contract.submitTransaction('RevokeAccess', recordId, userToRevoke , userrole);
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
        const wallet2 = await buildWallet(Wallets, walletPath2);
        const userIdentity = await wallet2.get(userId);
        const userrole = userIdentity.role;
        const result = await contract.submitTransaction('AddDocument', recordId, newDocument ,userrole);
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

// Calling AddJudgment
async function addJudgmentToLegalRecord(userId, recordId, judgment) {
    try {
        const contract = await getContract(userId);
        const result = await contract.submitTransaction('AddJudgment', recordId, judgment );
        return result ;
    } finally {
        await disconnectGateway();
    }
}

// Calling UpdateStatus
async function updateLegalRecordStatus(userId, recordId, newStatus) {
    try {
        const contract = await getContract(userId);
        const result = await contract.submitTransaction('UpdateStatus', recordId, newStatus);
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
        const ccp = buildCCPOrg2();
        const wallet = await buildWallet(Wallets, walletPath2);
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
    createLegalRecord,
    updateLegalRecord,
    grantAccessToLegalRecord ,
    revokeAccessToLegalRecord,
    getAllDocumentKeys ,
    getAllLegalRecords,
    addDocument,
    getUserFiles ,
    addJudgmentToLegalRecord,
    updateLegalRecordStatus,
    getCaseCounts,
}
