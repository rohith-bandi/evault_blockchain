const bcrypt = require('bcrypt');
const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const nodemailer = require('nodemailer'); // You need to install this package using npm install nodemailer
const path = require('path');
const { buildCAClient, registerAndEnrollUser , revokeAndRemoveUser , enrollAdmin } = require('../../test-application/javascript/CAUtil2.js');
const { buildCCPOrg2, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const walletPath1 = path.join(__dirname, 'wallet1');
const walletPath2 = path.join(__dirname, 'wallet2');
const adminUserId = 'admin';

async function createAdmin() {
        // Load the network configuration
        const ccp = buildCCPOrg2();

        // Build a CA client
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org2.example.com');

        // Create a new wallet
        const wallet2 = await buildWallet(Wallets, walletPath2);

        // Register and enroll the new user
        await enrollAdmin(caClient, wallet2);

}


async function createUser(userId,password,email,role) {
        // Load the network configuration
        const ccp = buildCCPOrg2();

        // Build a CA client
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org2.example.com');

        // Create a new wallet
        const wallet1 = await buildWallet(Wallets, walletPath1);
        const wallet2 = await buildWallet(Wallets, walletPath2);

        // Register and enroll the new user
        await registerAndEnrollUser(caClient, wallet1 , wallet2 , userId , password , email , role); 
        const msg = `User ${userId} is registered successfully as ${role}`;
        return msg ;
}


async function removeUser(userId) {
        // Load the network configuration
        const ccp = buildCCPOrg2();

        // Build a CA client
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org2.example.com');

        // Create a new wallet
        const wallet = await buildWallet(Wallets, walletPath2);

        // Revoke and remove the user
        await revokeAndRemoveUser(caClient, wallet,adminUserId,userId);

}

async function getUserDetails(userId) {
    try {
        // Load the network configuration
        const ccp = buildCCPOrg2();

        // Build a CA client
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org2.example.com');

        // Create a new wallet
        const wallet = await buildWallet(Wallets, walletPath2);

        const userIdentity = await wallet.get(userId);

        if (!userIdentity) {
            console.error(`User ${userId} not registered. Please register before logging in.`);
            return false;
        }

        return userIdentity;
    } catch (error) {
        console.error(`Error while getting user details: ${error.message}`);
        return null; // Or handle the error in an appropriate way
    }
}



// Utility function to verify a password
async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

async function loginUser(username, password , department) {
    try {
        // Load the network configuration
        const ccp = buildCCPOrg2();

        // Build a CA client
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org2.example.com');

        // Create a new wallet
        const wallet = await buildWallet(Wallets, walletPath2);

        // Check if the user exists in the wallet
        const userIdentity = await wallet.get(username);

        if (!userIdentity) {
            const err = `User ${username} is not registered.`;
            return err ;
        }

        if (userIdentity.role!=department){
            const err = `User ${username} is not registered as ${department}`;
            return err ;
        }


        // Verify the password
        const isPasswordValid = await verifyPassword(password, userIdentity.password);

        if (!isPasswordValid) {
            const err = 'Invalid password';
            return err;
        }

        const msg = `User ${username} successfully logged in.`;
        return msg ;
    } catch (error) {
        const msg = 'Something went wrong'
        return msg ;
    }
}



async function changePassword(userId , newPassword , useremail , userrole ) {
    try {
        // Load the network configuration
        const ccp = buildCCPOrg2();

        // Build a CA client
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org2.example.com');

        // Create a new wallet
        const wallet = await buildWallet(Wallets, walletPath2);

        // Check if the user exists in the wallet
        const userIdentity = await wallet.get(userId);

        if (!userIdentity) {
            console.error(`User ${userId} not registered. Cannot change password.`);
            return false;
        }
        // Store the modified user identity back in the wallet
        await wallet.put(userId, userIdentity , newPassword , useremail , userrole );
        return true;
    } catch (error) {
        console.error(`Error changing password for user ${userId}: ${error.message}`);
        return false;
    }
}


// Function to send a verification code to the user's email
async function sendVerificationCode(email) {
    // Implement your logic to generate and send a verification code
    const verificationCode = generateVerificationCode(); // Implement the function to generate a code
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'evaultg122@gmail.com',
            pass: 'mfth dikh ciut mqqa'
        }
    });

    const mailOptions = {
        from: 'evaultg122@gmail.com',
        to: email,
        subject: 'Evault OTP verification ',
        text: `Your verification code is: ${verificationCode}`
    };

    await transporter.sendMail(mailOptions);
    return verificationCode;
}

// Function to generate a random verification code
function generateVerificationCode() {
    // Implement your logic to generate a random code
    return Math.floor(200000 + Math.random() * 900000).toString();
}

// Forgot password function
async function forgotPassword(userid  , newpassword , useremail , userrole) {
    try {
        // Load the network configuration
        const ccp = buildCCPOrg2();

        // Build a CA client
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org2.example.com');

        // Create a new wallet
        const wallet = await buildWallet(Wallets, walletPath2);

        // Check if the user exists in the wallet
        const userIdentity = await wallet.get(userid);

        if (!userIdentity) {
                const err = `User ${userid} is not registered as ${userrole}..`;
                return err;
        }
        if (useremail!=userIdentity.email) {
            const err = `User with email ${useremail} is not registered .`;
            return err;
        }
        if (userIdentity.role!==userrole){
            const err = `User ${userid} not registered as ${userrole}`;
            return err;
        }

        // Change the password using the existing changePassword function
        await changePassword(userid ,newpassword , useremail , userrole);
        const msg = `Password changed successfully.`;
        return msg ;
    } catch (error) {
        const err = `Something went wrong.`;
        return err ;
    }
}

//getLawyerUsers function to return a JSON object
async function getLawyerUsers() {
    try {
        // Load the network configuration
        const ccp = buildCCPOrg2();

        // Build a CA client
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org2.example.com');

        // Create a new wallet
        const wallet2 = await buildWallet(Wallets, walletPath2);

        // Get all identities from the wallet
        const userIdentities = await wallet2.list();

        // Filter the lawyer users
        const lawyerUsers = {};
        for (const userId of userIdentities) {
            const userIdentity = await wallet2.get(userId);
            if (userIdentity && userIdentity.role === 'lawyer') {
                lawyerUsers[userId] = userIdentity;
            }
        }

        return lawyerUsers;
    } catch (error) {
        console.error(`Error in getLawyerUsers function: ${error.message}`);
        return null;
    }
}


//getJudgeUsers function to return a JSON object
async function getJudgeUsers() {
    try {
        // Load the network configuration
        const ccp = buildCCPOrg2();

        // Build a CA client
        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org2.example.com');

        // Create a new wallet
        const wallet2 = await buildWallet(Wallets, walletPath2);

        // Get all identities from the wallet
        const userIdentities = await wallet2.list();

        // Filter the judge users
        const JudgeUsers = {};
        for (const userId of userIdentities) {
            const userIdentity = await wallet2.get(userId);
            if (userIdentity && userIdentity.role === 'judge') {
                JudgeUsers[userId] = userIdentity;
            }
        }

        return JudgeUsers;
    } catch (error) {
        console.error(`Error in getLawyerUsers function: ${error.message}`);
        return null;
    }
}

createAdmin();
module.exports = {
    createUser,
    removeUser,
    loginUser,
    getUserDetails,
    getLawyerUsers,
    getJudgeUsers,
    forgotPassword,
    sendVerificationCode ,
    createAdmin
};


