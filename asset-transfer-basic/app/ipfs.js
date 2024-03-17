
const ipfsAPI = require('ipfs-api');
const fs = require('fs');
const path = require('path');

// Connect to an external IPFS node
const ipfs = ipfsAPI({ host: 'localhost', port: 5001, protocol: 'http' });

// Function to upload a file to IPFS
async function uploadFileToIPFS(fileContent) {
    try {

        // Upload the file to IPFS with extracted information
        const results = await ipfs.files.add({
            content: fileContent,
        });

        // Return the IPFS link for future reference
        return results[0].hash;
    } catch (error) {
        console.error('Error uploading file to IPFS:', error);
        throw error;
    }
}

// Function to retrieve a file from IPFS
async function retrieveFileFromIPFS(ipfsLink) {
    try {
        // Retrieve the file from IPFS
        const fileContent = await ipfs.files.cat(ipfsLink);

        // Write the content to a file
        fs.writeFileSync('judgement.pdf', fileContent);
    } catch (error) {
        console.error('Error retrieving file from IPFS:', error);
        throw error;
    }
}

module.exports={
  uploadFileToIPFS,
  retrieveFileFromIPFS,
}


