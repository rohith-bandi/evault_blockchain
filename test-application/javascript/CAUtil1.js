/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const adminUserId = 'admin';
const adminUserPasswd = 'adminpw';
const adminemail = 'admin@email.com' ;

/**
 *
 * @param {*} FabricCAServices
 * @param {*} ccp
 */
exports.buildCAClient = (FabricCAServices, ccp, caHostName) => {
	// Create a new CA client for interacting with the CA.
	const caInfo = ccp.certificateAuthorities[caHostName]; //lookup CA details from config
	const caTLSCACerts = caInfo.tlsCACerts.pem;
	const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
	return caClient;
};

exports.enrollAdmin = async (caClient, wallet) => {
	try {
		// Check to see if we've already enrolled the admin user.
		const identity = await wallet.get(adminUserId);
		if (identity) {
			return;
		}

		// Enroll the admin user, and import the new identity into the wallet.
		const enrollment = await caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd });
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: 'Org1MSP',
			type: 'X.509',
		};
		await wallet.put(adminUserId, x509Identity,adminUserPasswd,adminemail,'admin');
	} catch (error) {
		console.error(`Failed to enroll admin user : ${error}`);
	}
};

exports.registerAndEnrollUser = async (caClient, wallet1 , wallet2 , userId,userpw,useremail,userrole) => {
	try {
		// Check to see if we've already enrolled the user
		const userIdentity = await wallet1.get(userId);
		if (userIdentity) {
			return;
		}
		const userIdentity2 = await wallet2.get(userId);
		if (userIdentity2) {
			return;
		}

		// Must use an admin to register a new user
		const adminIdentity = await wallet1.get(adminUserId);
		if (!adminIdentity) {
			return;
		}
       
		// build a user object for authenticating with the CA
		const provider = wallet1.getProviderRegistry().getProvider(adminIdentity.type);
		const adminUser = await provider.getUserContext(adminIdentity, adminUserId);
		// Register the user, enroll the user, and import the new identity into the wallet.
		// if affiliation is specified by client, the affiliation value must be configured in CA
		const secret = await caClient.register({
			affiliation: 'org1.department1',
			enrollmentID: userId
		}, adminUser);
		const enrollment = await caClient.enroll({
			enrollmentID: userId,
			enrollmentSecret: secret
		});
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: 'Org1MSP',
			type: 'X.509',
		};
		await wallet1.put(userId, x509Identity,userpw,useremail,userrole);
	} catch (error) {
		console.error(`Failed to register user : ${error}`);
	}
};

exports.revokeAndRemoveUser = async (caClient, wallet, registrar, userId) => {
    try {
        const adminIdentity = await wallet.get(registrar);
        if (!adminIdentity) {
            return;
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, registrar);

        // Revoke the user
        await caClient.revoke({ enrollmentID: userId }, adminUser);

        // Remove the user
        await wallet.remove(userId);
    } catch (error) {
        console.error(`Failed to revoke and remove user ${userId}: ${error}`);
    }
};




