'use strict';

const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class LegalRecordVault extends Contract {

    async CreateLegalRecord(ctx, record, documents , role) {
        const exists = await this.LegalRecordExists(ctx, record);
        if (exists) {
            return `The case file ${record} already exists`;
        }
    
        const uploaderID = this.getUploaderID(ctx);
        const timestampSeconds = ctx.stub.getTxTimestamp().seconds.low;
    
        // Convert to Indian Standard Time (IST)
        const timestamp = new Date(timestampSeconds * 1000);
        timestamp.setUTCHours(timestamp.getUTCHours() + 5); // Add 5 hours for IST
        timestamp.setUTCMinutes(timestamp.getUTCMinutes() + 30); // Add 30 minutes for IST
    
        // Parse the documents JSON string to a JavaScript object
        const documentsObject = JSON.parse(documents);
    
        const legalRecord = {
            Record: record,
            Document: documentsObject,
            Creator: `${uploaderID}-${role}`,
            Timestamp: timestamp,
            AccessControl: {},
            Status: 'Open', // New field for status
            Judgement: null, // New field for judgment
            Logs: {},
        };

        legalRecord.Logs[timestamp] = { Action: 'Create', Actor: `${uploaderID}-${role}`, DateTime: timestamp, CreatedDoc: documentsObject };
    
        legalRecord.AccessControl[uploaderID] = role; // Use ID in the access control list
    
        await ctx.stub.putState(record, Buffer.from(stringify(sortKeysRecursive(legalRecord))));
        return 'Case file created successfully';
    }

    async ReadLegalRecord(ctx, record) {
        const legalRecordJSON = await ctx.stub.getState(record);
        if (!legalRecordJSON || legalRecordJSON.length === 0) {
            return `The case file ${record} does not exist`;
        }

        const legalRecord = JSON.parse(legalRecordJSON.toString());

        const invokerID = this.getInvokerID(ctx);
        if (!legalRecord.AccessControl[invokerID]) {
            return `You don't have access on the case file ${record}`;
        }

        return JSON.stringify(legalRecord);
    }

    async AddJudgment(ctx, record, judgment) {
        const legalRecordString = await this.ReadLegalRecord(ctx, record);
        const legalRecord = JSON.parse(legalRecordString);

        const invokerID = this.getInvokerID(ctx);
        if (!legalRecord.AccessControl[invokerID]) {
            return `You don't have access on the case file ${record}` ;
        }

        const timestampSeconds = ctx.stub.getTxTimestamp().seconds.low;
        const timestamp = new Date(timestampSeconds * 1000);
        timestamp.setUTCHours(timestamp.getUTCHours() + 5); // Add 5 hours for IST
        timestamp.setUTCMinutes(timestamp.getUTCMinutes() + 30); // Add 30 minutes for IST

        legalRecord.Judgement =  judgment ;

        legalRecord.Logs[timestamp] = {
            Action: 'AddJudgment',
            Actor: `${invokerID}-judge`,
            DateTime: timestamp,
            JudgmentText: judgment,
        };

        await ctx.stub.putState(record, Buffer.from(stringify(sortKeysRecursive(legalRecord))));
        return 'Judgment updated successfully';
    }

    async UpdateStatus(ctx, record, newStatus) {
        const legalRecordString = await this.ReadLegalRecord(ctx, record);
        const legalRecord = JSON.parse(legalRecordString);

        const invokerID = this.getInvokerID(ctx);
        if (!legalRecord.AccessControl[invokerID]) {
            return `You don't have access on the case file ${record}` ;
        }

        const timestampSeconds = ctx.stub.getTxTimestamp().seconds.low;
        const timestamp = new Date(timestampSeconds * 1000);
        timestamp.setUTCHours(timestamp.getUTCHours() + 5); // Add 5 hours for IST
        timestamp.setUTCMinutes(timestamp.getUTCMinutes() + 30); // Add 30 minutes for IST

        legalRecord.Status = newStatus;

        legalRecord.Logs[timestamp] ={
            Action: 'UpdateStatus',
            Actor: `${invokerID}-judge`,
            DateTime: timestamp,
            NewStatus: newStatus,
        };

        await ctx.stub.putState(record, Buffer.from(stringify(sortKeysRecursive(legalRecord))));
        return JSON.stringify(legalRecord);
    }

    async GrantAccess(ctx, record, userID, role) {
        const status = await this.GetStatus(ctx, record);
        if (status === 'Closed') {
            return `The case file ${record} is closed.`;
        }
    
        const legalRecordString = await this.ReadLegalRecord(ctx, record);
        const legalRecord = JSON.parse(legalRecordString);
    
        const invokerID = this.getInvokerID(ctx);
        if (!legalRecord.AccessControl[invokerID]) {
            return `You don't have access on the case file ${record}`;
        }
    
        const irole = legalRecord.AccessControl[invokerID];
    
        // Check if the user already has access
        if (legalRecord.AccessControl[userID]) {
            return `User ${userID} already have access.`;
        }
    
        legalRecord.AccessControl[userID] = role;
    
        const timestampSeconds = ctx.stub.getTxTimestamp().seconds.low;
    
        // Convert to Indian Standard Time (IST)
        const timestamp = new Date(timestampSeconds * 1000);
        timestamp.setUTCHours(timestamp.getUTCHours() + 5); // Add 5 hours for IST
        timestamp.setUTCMinutes(timestamp.getUTCMinutes() + 30); // Add 30 minutes for IST
        legalRecord.Logs[timestamp] = { Action: 'GrantAccess', Actor: `${invokerID}-${irole}`, DateTime: timestamp, GrantedUserID: `${userID}-${role}` };
    
        await ctx.stub.putState(record, Buffer.from(stringify(sortKeysRecursive(legalRecord))));
        return 'Access granted successfully' ;
    }
    
    async RevokeAccess(ctx, record, userID,role) {

        const status = await this.GetStatus(ctx, record);
        if (status === 'Closed') {
            return `The case file ${record} is closed.` ;
        }

        const legalRecordString = await this.ReadLegalRecord(ctx, record);
        const legalRecord = JSON.parse(legalRecordString);
    
        const invokerID = this.getInvokerID(ctx);
        if (!legalRecord.AccessControl[invokerID]) {
            return `You don't have access on the case file ${record}`;
        }
    
        if (!legalRecord.AccessControl[userID]) {
            return `User ${userID} don't have access on the case file`;
        }

        const irole = legalRecord.AccessControl[invokerID] ;
    
        delete legalRecord.AccessControl[userID];
    
        const timestampSeconds = ctx.stub.getTxTimestamp().seconds.low;

        // Convert to Indian Standard Time (IST)
        const timestamp = new Date(timestampSeconds * 1000);
        timestamp.setUTCHours(timestamp.getUTCHours() + 5); // Add 5 hours for IST
        timestamp.setUTCMinutes(timestamp.getUTCMinutes() + 30); // Add 30 minutes for IST
        legalRecord.Logs[timestamp] = { Action: 'RevokeAccess', Actor: `${invokerID}-${irole}`, DateTime: timestamp, RevokedUserID: `${userID}-${role}` };
    
        await ctx.stub.putState(record, Buffer.from(stringify(sortKeysRecursive(legalRecord))));
        return 'Access revoked successfully';
    }

    async UpdateLegalRecord(ctx, record, updatedKey, updatedValue,role) {

        const status = await this.GetStatus(ctx, record);
        if (status === 'Closed') {
            return `The case file ${record} is closed.`;
        }

        const exists = await this.LegalRecordExists(ctx, record);
        if (!exists) {
            return `The case file ${record} does not exist`;
        }
    
        const legalRecordString = await this.ReadLegalRecord(ctx, record);
        const legalRecord = JSON.parse(legalRecordString);
    
        const invokerID = this.getInvokerID(ctx);
        if (!legalRecord.AccessControl[invokerID]) {
            return `You don't have access on the case file ${record}`;
        }
    
        const timestampSeconds = ctx.stub.getTxTimestamp().seconds.low;
    
        // Convert to Indian Standard Time (IST)
        const timestamp = new Date(timestampSeconds * 1000);
        timestamp.setUTCHours(timestamp.getUTCHours() + 5); // Add 5 hours for IST
        timestamp.setUTCMinutes(timestamp.getUTCMinutes() + 30); // Add 30 minutes for IST
        legalRecord.Logs[timestamp] = {
            Action: 'Update',
            Actor: `${invokerID}-${role}`,
            DateTime: timestamp,
            UpdatedKey: updatedKey,
            UpdatedValue : updatedValue
        };
    
        legalRecord.Document[updatedKey] = updatedValue;
    
        await ctx.stub.putState(record, Buffer.from(JSON.stringify(legalRecord)));
        return 'Case file updated successfully';
    }

    async AddDocument(ctx, record, newDocument, role) {
        const status = await this.GetStatus(ctx, record);
        if (status === 'Closed') {
            return `The case file ${record} is closed.`;
        }
    
        const legalRecordString = await this.ReadLegalRecord(ctx, record);
        const legalRecord = JSON.parse(legalRecordString);
    
        const uploaderID = this.getUploaderID(ctx);
        const timestampSeconds = ctx.stub.getTxTimestamp().seconds.low;
    
        // Convert to Indian Standard Time (IST)
        const timestamp = new Date(timestampSeconds * 1000);
        timestamp.setUTCHours(timestamp.getUTCHours() + 5); // Add 5 hours for IST
        timestamp.setUTCMinutes(timestamp.getUTCMinutes() + 30); // Add 30 minutes for IST
    
        const documentsObject = JSON.parse(newDocument);
        const newDocumentName = Object.keys(documentsObject)[0]; // Extracting the document name
    
        // Check if the document name already exists
        if (legalRecord.Document && legalRecord.Document[newDocumentName]) {
            return `${newDocumentName} already exists in the case file ${record}`;
        }
    
        const newDocumentEntry = {
            Action: 'AddDocument',
            Actor: `${uploaderID}-${role}`,
            DateTime: timestamp,
            AddedDocument: documentsObject
        };
    
        // Merge new document into existing Document object
        legalRecord.Document = { ...legalRecord.Document, ...documentsObject };
    
        legalRecord.Logs[timestamp] = newDocumentEntry;
    
        // Update the existing legal record in the ledger
        await ctx.stub.putState(record, Buffer.from(stringify(sortKeysRecursive(legalRecord))));
        return 'Document added successfully';
    }
    

    async GetAllDocumentKeys(ctx, record) {
        const legalRecordString = await this.ReadLegalRecord(ctx, record);
        const legalRecord = JSON.parse(legalRecordString);
    
        // Check if the invoker has access to the legal record
        const invokerID = this.getInvokerID(ctx);
        if (!legalRecord.AccessControl[invokerID]) {
            return `You don't have access on the case file ${record}`;
        }
    
        // Extract and return only the keys of the documents
        const documentKeys = Object.keys(legalRecord.Document);
        return JSON.stringify(documentKeys);
    }
    
    async GetUserFiles(ctx) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        const invokerID = this.getInvokerID(ctx);
    
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
    
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                record = strValue;
            }
    
            // Check if the record has the AccessControl property and if the user has access
            if (record.AccessControl && record.AccessControl[invokerID]) {
                allResults.push(record);
            }
    
            result = await iterator.next();
        }
    
        return JSON.stringify(allResults);
    }

    async GetAllLegalRecords(ctx) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    async GetLogs(ctx, record) {
        const legalRecordString = await this.ReadLegalRecord(ctx, record);
        const legalRecord = JSON.parse(legalRecordString);
    
        // Check if the invoker has access to the legal record
        const invokerID = this.getInvokerID(ctx);
        if (!legalRecord.AccessControl[invokerID]) {
            return `You don't have access on the case file ${record}`;
        }
    
        return JSON.stringify(legalRecord.Logs);
    }
    
    async GetLegalRecordCounts(ctx) {
        try {
            // Get all user files
            const result = await this.GetUserFiles(ctx);
            const userFiles = JSON.parse(result);
    
            // Initialize counts
            let ongoingCount = 0;
            let closedCount = 0;
    
            // Count ongoing and closed legal records
            for (const file of userFiles) {
                const { Status } = file ;
                if (Status === 'Open') {
                    ongoingCount++;
                } else if (Status === 'Closed') {
                    closedCount++;
                }
            }
    
            const counts = { ongoingCount, closedCount };
    
            return JSON.stringify(counts);
        } catch (error) {
            return null;
        }
    }
    
    
    

    getUploaderID(ctx) {
        const clientIdentity = ctx.clientIdentity;
        const uploaderID = clientIdentity.getID();
        const cn = this.extractCN(uploaderID);
        return cn || "UnknownUploader";
    }
    
    getInvokerID(ctx) {
        const clientIdentity = ctx.clientIdentity;
        const invokerID = clientIdentity.getID();
        const cn = this.extractCN(invokerID);
        return cn || "UnknownInvoker";
    }
    
    extractCN(identity) {
        const match = identity.match(/CN=([^/]+)/);
        const cn = match ? match[1] : null;
        return cn ? cn.replace(/::/g, '') : null;
    }

    async GetStatus(ctx, record) {
        const legalRecordString = await this.ReadLegalRecord(ctx, record);
        const legalRecord = JSON.parse(legalRecordString);
        return legalRecord.Status || 'Unknown';
    }

    async LegalRecordExists(ctx, record) {
        const legalRecordJSON = await ctx.stub.getState(record);
        return legalRecordJSON && legalRecordJSON.length > 0;
    }
}

module.exports = LegalRecordVault;

    