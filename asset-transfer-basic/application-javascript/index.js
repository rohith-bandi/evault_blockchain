const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const org1 = require('./org1user.js');
const org2 = require('./org2user.js');
const IPFS = require('./ipfs.js');
const functions1 = require('./app1.js');
const functions2 = require('./app2.js');
const multer = require('multer');
const app = express();
app.use(express.static('public')); 
const router = express.Router();
const port = 3000;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.post('/adminpdf', async (req, res) => {
    try {
        const { documentLink } = req.body;
        
        // Retrieve the PDF content from IPFS
        await IPFS.retrieveFileFromIPFS(documentLink);

        // Pass the PDF content to the EJS template for rendering
        res.render('adminpdf.ejs');
    } catch (error) {
        console.error('Error while retrieving PDF:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/judgepdf', async (req, res) => {
    try {
        const { documentLink } = req.body;
        
        // Retrieve the PDF content from IPFS
        await IPFS.retrieveFileFromIPFS(documentLink);

        // Pass the PDF content to the EJS template for rendering
        res.render('judgepdf.ejs');
    } catch (error) {
        console.error('Error while retrieving PDF:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/clientpdf', async (req, res) => {
    try {
        const { documentLink } = req.body;
        
        // Retrieve the PDF content from IPFS
        await IPFS.retrieveFileFromIPFS(documentLink);

        // Pass the PDF content to the EJS template for rendering
        res.render('clientpdf.ejs');
    } catch (error) {
        console.error('Error while retrieving PDF:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/lawyerpdf', async (req, res) => {
    try {
        const { documentLink } = req.body;
        
        // Retrieve the PDF content from IPFS
        await IPFS.retrieveFileFromIPFS(documentLink);

        // Pass the PDF content to the EJS template for rendering
        res.render('lawyerpdf.ejs');
    } catch (error) {
        console.error('Error while retrieving PDF:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/view-pdf', (req, res) => {
    try {
        const pdfPath = 'judgement.pdf';
        const stream = fs.createReadStream(pdfPath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${pdfPath.split('/').pop()}"`);
        stream.pipe(res);
    } catch (error) {
        console.error('Error while streaming PDF:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/adminlogs', async (req, res) => {
    try {
        const { logs } = req.body;
        const data = JSON.parse(logs)
        // Render the EJS template and pass the combined 'Logs' array
        res.render('adminlogs.ejs', { data } );
    } catch (error) {
        console.error('Error in /adminlogs:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/adminaccess', async (req, res) => {
    try {
        const { list } = req.body;
        const data = JSON.parse(list)
        // Render the EJS template and pass the combined 'Logs' array
        res.render('adminaccess.ejs', { data } );
    } catch (error) {
        console.error('Error in /adminaccesslist:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/admindocs', async (req, res) => {
    try {
        const { docs } = req.body;
        const data = JSON.parse(docs);
        // Render the EJS template and pass the combined 'Logs' array
        res.render('admindocs.ejs', { data } );
    } catch (error) {
        console.error('Error in /admindocs:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/judgelogs', async (req, res) => {
    try {
        const { logs } = req.body;
        const data = JSON.parse(logs)
        // Render the EJS template and pass the combined 'Logs' array
        res.render('judgelogs.ejs', { data } );
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/judgelist', async (req, res) => {
    try {
        const { list } = req.body;
        const data = JSON.parse(list)
        // Render the EJS template and pass the combined 'Logs' array
        res.render('judgelist.ejs', { data } );
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/judgedocs', async (req, res) => {
    try {
        const { docs } = req.body;
        const data = JSON.parse(docs);
        // Render the EJS template and pass the combined 'Logs' array
        res.render('judgedocs.ejs', { data } );
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/lawyerlogs', async (req, res) => {
    try {
        const { logs } = req.body;
        const data = JSON.parse(logs)
        // Render the EJS template and pass the combined 'Logs' array
        res.render('lawyerlogs.ejs', { data } );
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/lawyerlist', async (req, res) => {
    try {
        const { list } = req.body;
        const data = JSON.parse(list)
        // Render the EJS template and pass the combined 'Logs' array
        res.render('lawyerlist.ejs', { data } );
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/lawyerdocs', async (req, res) => {
    try {
        const { docs } = req.body;
        const data = JSON.parse(docs);
        // Render the EJS template and pass the combined 'Logs' array
        res.render('lawyerdocs.ejs', { data } );
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/clientlogs', async (req, res) => {
    try {
        const { logs } = req.body;
        const data = JSON.parse(logs)
        // Render the EJS template and pass the combined 'Logs' array
        res.render('clientlogs.ejs', { data } );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/clientlist', async (req, res) => {
    try {
        const { list } = req.body;
        const data = JSON.parse(list)
        // Render the EJS template and pass the combined 'Logs' array
        res.render('clientlist.ejs', { data } );
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/clientdocs', async (req, res) => {
    try {
        const { docs } = req.body;
        const data = JSON.parse(docs);
        // Render the EJS template and pass the combined 'Logs' array
        res.render('clientdocs.ejs', { data } );
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/', (req, res) => {
    const notice = fs.readFileSync('notice1.pdf'); 
    res.render('home.ejs', { notice });
});

app.get('/ppt', async(req, res) => {
    res.render('ppt.ejs');
});

app.get('/notice', (req, res) => {
    try {
        const pdfPath = 'notice.pdf';
        const stream = fs.createReadStream(pdfPath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${pdfPath.split('/').pop()}"`);
        stream.pipe(res);
    } catch (error) {
        console.error('Error while streaming PDF:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/login', (req, res) => {
    res.render('login.ejs', { err_msg :null }); // Pass the error to the login template
});

app.get('/signup', (req, res) => {
    res.render('signup.ejs', { err_msg :null }); // Pass the error to the login template
});

app.get('/admindash', async (req, res) => {
    try {
        const counts = await org1.countRolesInBothWallets();
        if (!counts) {
            throw new Error("Failed to get role counts");
        }
        const list = [counts.totalLawyers, counts.totalClients, counts.totalJudges];
        res.render('admindash.ejs', { list });
    } catch (error) {
        console.error(`Error rendering admin dashboard: ${error.message}`);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/adminlogs', async(req, res) => {
    
    res.render('adminlogs.ejs');
});

app.get('/adminnote', async(req, res) => {
    const {imsg} = req.query ;
    return res.render('adminnote.ejs', {msg : imsg});
});

app.get('/adminusers', (req, res) => {
    const {umsg} = req.query ;
    return res.render('adminusers.ejs', {msg : umsg});
});

app.get('/adminrecords', (req, res) => {
    const {dmsg} = req.query ;
    res.render('adminrecords.ejs' , {msg : dmsg});
});

app.get('/lawyerdash', async (req, res) => {
    try {
        const userId = req.session.userId;
        const result = await functions2.getCaseCounts(userId);
        const result1 = JSON.parse(result);
        const list = [result1.ongoingCount, result1.closedCount];
        res.render('lawyerdash.ejs', { list , userId});
    } catch (error) {
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/lawyercreate', (req, res) => {
    
    res.render('lawyercreate.ejs',{msg:null});
});

app.get('/lawyerupdate', async(req, res) => {
    try {
        const userId = req.session.userId;
        const result = await functions2.getUserFiles(userId);
        const data = JSON.parse(result).map(record => ({
            RecordName: record.Record,
            Document: Object.keys(record.Document), // Only taking keys of record.Document
            DocLink: Object.values(record.Document)
        }));
        const { umsg } = req.query;
        return res.render('lawyerupdate.ejs', { records: data , msg : umsg });
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/lawyeradddoc', async(req, res) => {
    try {
        const userId = req.session.userId;
        const result = await functions2.getUserFiles(userId);
        const data = JSON.parse(result).map(record => record.Record);
        const { amsg } = req.query;
        return res.render('lawyeradddoc.ejs', { records: data , msg : amsg});
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/lawyeraccess', async(req, res) => {
    
    try {
        const userId = req.session.userId;
        const result = await functions2.getUserFiles(userId);
        const data = JSON.parse(result).map(record => record.Record);
        const {lmsg} = req.query ;
        return res.render('lawyeraccess.ejs', { records: data , msg : lmsg});
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/lawyerrevoke', async(req, res) => {
    
    try {
        const userId = req.session.userId;
        const result = await functions2.getUserFiles(userId);
        const data = JSON.parse(result).map(record => record.Record);
        const {rmsg} = req.query ;
        return res.render('lawyerrevoke.ejs', { records: data , msg : rmsg});
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/lawyerview', async(req, res) => {
    const {vmsg} = req.query ;
    res.render('lawyerview.ejs' , {msg : vmsg});
});

app.get('/judgedash', async (req, res) => {
    try {
        const userId = req.session.userId;
        const result = await functions2.getCaseCounts(userId);
        const result1 = JSON.parse(result);
        const list = [result1.ongoingCount, result1.closedCount];
        res.render('judgedash.ejs', { list , userId});
    } catch (error) {
        console.error(`Failed to render judge dashboard: ${error}`);
        // Handle the error appropriately
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/judgeupdate', async(req, res) => {
    
    try {
        const userId = req.session.userId;
        const result = await functions2.getUserFiles(userId);
        const data = JSON.parse(result).map(record => ({
            RecordName: record.Record,
            Document: Object.keys(record.Document) // Only taking keys of record.Document
        }));
        const {umsg} = req.query;
        return res.render('judgeupdate.ejs', { records: data  , msg : umsg});
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/judgeadddoc', async(req, res) => {
    
    try {
        const userId = req.session.userId;
        const result = await functions2.getUserFiles(userId);
        const data = JSON.parse(result).map(record => record.Record);
        const {amsg} = req.query ;
        return res.render('judgeadddoc.ejs', { records: data , msg : amsg });
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/judgeaccess', async(req, res) => {
    try {
        const userId = req.session.userId;
        const result = await functions2.getUserFiles(userId);
        const data = JSON.parse(result).map(record => record.Record);
        const {lmsg} = req.query ;
        return res.render('judgeaccess.ejs', { records: data , msg : lmsg});
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/judgerevoke', async(req, res) => {
    try {
        const userId = req.session.userId;
        const result = await functions2.getUserFiles(userId);
        const data = JSON.parse(result).map(record => record.Record);
        const {rmsg} = req.query ;
        return res.render('judgerevoke.ejs', { records: data , msg : rmsg});
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/judgeview', async(req, res) => {
    const {vmsg} = req.query ;
    res.render('judgeview.ejs' , {msg : vmsg});
});

app.get('/judgement', async(req, res) => {
    try {
        const userId = req.session.userId;
        const result = await functions2.getUserFiles(userId);
        const data = JSON.parse(result).map(record => record.Record);
        const {jmsg} = req.query ; 
        return res.render('judgement.ejs', { records: data , msg : jmsg});
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/clientdash', async (req, res) => {
    try {
        const userId = req.session.userId;
        const result = await functions1.getCaseCounts(userId);
        const result1 = JSON.parse(result);
        const list = [result1.ongoingCount, result1.closedCount];
        res.render('clientdash.ejs', { list , userId });
    } catch (error) {
        console.error(`Failed to render client dashboard: ${error}`);
        // Handle the error appropriately
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});


app.get('/forgot',(req, res) => {
    res.render('forgot.ejs', { err_msg : null });
});

app.get('/clientupdate', async(req, res) => {
    
    try {
        const userId = req.session.userId;
        const result = await functions1.getUserFiles(userId);
        const data = JSON.parse(result).map(record => ({
            RecordName: record.Record,
            Document: Object.keys(record.Document) // Only taking keys of record.Document
        }));
        const {umsg} = req.query ;
        return res.render('clientupdate.ejs', { records: data , msg:umsg });
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/clientadddoc', async(req, res) => {
    
    try {
        const userId = req.session.userId;
        const result = await functions1.getUserFiles(userId);
        const data = JSON.parse(result).map(record => record.Record);
        const {amsg} = req.query ;
        return res.render('clientadddoc.ejs', { records: data , msg : amsg});
    } catch (error) {
        console.error('Error :', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/clientview', async(req, res) => {
    const {vmsg} = req.query ;
    res.render('clientview.ejs' , {msg : vmsg});
});

app.post('/noteset', upload.single('myfile'), (req, res) => {
    const { notice, Password } = req.body;
    const userId = req.session.userId;
    const pass = req.session.pass;
    const department = req.session.department;

    if (!userId) {
        return res.redirect('/login');
    }

    if (Password !== pass) {
        return res.redirect(`adminnote?imsg=Incorrect password`);
    }

    if (!req.file) {
        return res.status(400).send('No file was uploaded.');
    }
    const fileContent = req.file.buffer;

    try {
        // Write buffer content to notice.pdf
        fs.writeFileSync('notice1.pdf', notice);
        fs.writeFileSync('notice.pdf', fileContent);
        return res.redirect(`adminnote?imsg=Notification uploaded successfully`); // Redirect to the dashboard or any other page
    } catch (err) {
        console.error('Error writing file:', err);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/send-otp', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }
      const OTP = await org1.sendVerificationCode(email);
      req.session.OTP = OTP;
      req.session.email = email;
      res.status(200).send();
    } catch (error) {
      console.error('Error in /submitemail:', error);
      res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
  });
  
app.post('/createuser', async (req, res)=> {
    try {
      const { userId, pass, email, department , otp } = req.body;
      const OTP = req.session.OTP ;
      const eml = req.session.email ;
      if(!OTP || !eml){
        return res.render('signup.ejs',{err_msg: 'Invalid Verification with email'})
      }
      if(email!=eml){
        return res.render('signup.ejs',{err_msg: 'Invalid  email'})
      }
      if(OTP!=otp){
        return res.render('signup.ejs', {err_msg :'OTP is incorrect'}) 
      }
      if (department === 'client') {
        const msg = await org1.createUser(userId, pass, email, department);
        return res.render('signup.ejs' , {err_msg : msg});
      } else {
        const msg = await org2.createUser(userId, pass, email, department);
        return res.render('signup.ejs' , {err_msg : msg});
      }
    } catch (error) {
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
  });
  
app.post('/forgotpass', async (req, res) => {
    try {
      const { userId,newpw , otp ,email,department} = req.body;
      const OTP = req.session.OTP ;
      if(otp!=OTP){
        return res.render('forgot.ejs' , {err_msg :'Otp is incorrect'});
      }
      if(department==="lawyer" || department==="judge"){
        const msg = await org2.forgotPassword(userId,newpw,email,department);
        return res.render('forgot.ejs' , {err_msg : msg });
      }
      else{
        const msg = await org1.forgotPassword(userId,newpw,email,department);
        return res.render('forgot.ejs' , {err_msg : msg });
      }
    } catch (error) {
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
  });

app.post('/login', async (req, res) => {
    try {
        const { userId, pass, department } = req.body;
        if (department === 'admin') {
            if(userId === 'admin' && pass === 'adminpw'){
                req.session.userId = userId;
                req.session.pass = pass;
                req.session.department = department;
                const counts = await org1.countRolesInBothWallets();
                if (!counts) {
                    throw new Error("Failed to get role counts");
                }
                const list = [counts.totalLawyers, counts.totalClients, counts.totalJudges];
                return res.render('admindash.ejs', { list, userId }); 
            }
            else{
                return res.render('login.ejs', { err_msg : 'Invalid credentials' });
            }
        } else if (department === 'lawyer') {
            const result = await org2.loginUser(userId, pass, department);
            if (result===`User ${userId} successfully logged in.`) {
                req.session.userId = userId;
                req.session.pass = pass;
                req.session.department = department;
                const result1 = await functions2.getCaseCounts(userId);
                const result2 = JSON.parse(result1);
                const list = [result2.ongoingCount, result2.closedCount];
                return res.render('lawyerdash.ejs', { list, userId });
            } else {
                return res.render('login.ejs', { err_msg : result });
            }
        } else if (department === 'judge') {
            const result = await org2.loginUser(userId, pass, department);
            if (result===`User ${userId} successfully logged in.`) {
                req.session.userId = userId;
                req.session.pass = pass;
                req.session.department = department;
                const result1 = await functions2.getCaseCounts(userId);
                const result2 = JSON.parse(result1);
                const list = [result2.ongoingCount, result2.closedCount];
                return res.render('judgedash.ejs', { list, userId });
            } else {
                return res.render('login.ejs', { err_msg: result });
            }
        } else if (department === 'client') {
            const result = await org1.loginUser(userId, pass, department);
            if (result===`User ${userId} successfully logged in.`) {
                req.session.userId = userId;
                req.session.pass = pass;
                req.session.department = department;
                const result1 = await functions1.getCaseCounts(userId);
                const result2 = JSON.parse(result1);
                const list = [result2.ongoingCount, result2.closedCount];
                return res.render('clientdash.ejs', { list, userId });
            } else {
                return res.render('login.ejs', { err_msg: result });
            }
        } 
    } catch (error) {
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/createrecord', upload.single('myfile'), async (req, res) => {
    try {
        const { recordName, Password } = req.body;
        const userId = req.session.userId;
        const pass = req.session.pass;
        const department = req.session.department;

        if (!userId) {
            return res.redirect('/login');
        }

        if (Password !== pass) {
            return res.render(`${department}create.ejs`, { msg : 'Incorrect password' });
        }

        if (!req.file) {
            return res.status(400).send('No file was uploaded.');
        }

        const fileContent = req.file.buffer;
        const contentType = req.file.mimetype; // Get the content type (MIME type)

        const content = await IPFS.uploadFileToIPFS(fileContent, contentType);

        const newfile = { [req.file.originalname]: content };
        const fileContentsJSON = JSON.stringify(newfile);
        
        const result = await functions2.createLegalRecord(userId, recordName, fileContentsJSON);
        return res.render(`${department}create.ejs`, { msg : result });
    } catch (error) {
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/viewdata', async (req, res) => {
    try {
        const { Password } = req.query;
        const userId = req.session.userId;
        const userPassword = req.session.pass;
        const department = req.session.department;
        if (Password !== userPassword) {
            return res.redirect(`${department}view?vmsg=Incorrect password`);
        }
        let result ;
        if (department==="lawyer"){
            result = await functions2.getUserFiles(userId);
            const data = JSON.parse(result);
            return res.render('lawyerdata.ejs',{data})
        }
        else if (department==="judge"){
            result = await functions2.getUserFiles(userId);
            const data = JSON.parse(result);
            return res.render('judgedata.ejs',{data})
        }
        else if(department==="client"){
            result = await functions1.getUserFiles(userId);
            const data = JSON.parse(result);
            return res.render('clientdata.ejs',{data})
        }
    } catch (error) {
        console.error('Error processing /readRecord:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/updateRecord', upload.single('myfile'), async (req, res) => {
    try {
        const { Password, recordName } = req.body;
        const [selectedRecord, selectedDocument] = recordName.split("::");
        const userId = req.session.userId;
        const pass = req.session.pass;
        const department = req.session.department;

        if (!userId) {
            return res.redirect('/login');
        }

        if (Password !== pass) {
            return res.redirect(`${department}update?umsg=Incorrect password`);
        }

        if (!req.file) {
            return res.status(400).send('No file was uploaded.');
        }

        const fileContent = req.file.buffer;
        const contentType = req.file.mimetype; // Get the content type (MIME type)

        const content = await IPFS.uploadFileToIPFS(fileContent, contentType);


        let result ;
        if (department==="lawyer"){
            result = await functions2.updateLegalRecord(userId, selectedRecord, selectedDocument, content);
            return res.redirect(`${department}update?umsg=${result}`);
        }
        else if (department==="judge"){
            result = await functions2.updateLegalRecord(userId, selectedRecord, selectedDocument, content);
            return res.redirect(`${department}update?umsg=${result}`);
        }
        else if(department==="client"){
            result = await functions1.updateLegalRecord(userId, selectedRecord, selectedDocument, content);
            return res.redirect(`${department}update?umsg=${result}`);
        }
    } catch (error) {
        console.error('Error processing /readRecord:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/adddoc', upload.single('myfile'), async (req, res) => {
    try {
        const { recordName, Password } = req.body;
        const userId = req.session.userId;
        const pass = req.session.pass;
        const department = req.session.department;

        if (!userId) {
            return res.redirect('/login');
        }

        if (Password !== pass) {
            return res.redirect(`${department}adddoc?amsg=Incorrect password`);
        }

        if (!req.file) {
            return res.status(400).send('No file was uploaded.');
        }

        const fileContent = req.file.buffer;
        const contentType = req.file.mimetype; // Get the content type (MIME type)

        const content = await IPFS.uploadFileToIPFS(fileContent, contentType);

        const newfile = { [req.file.originalname]: content };
        const fileContentsJSON = JSON.stringify(newfile);
        
        let result ;
        if (department==="lawyer"){
            result = await functions2.addDocument(userId, recordName, fileContentsJSON);
            return res.redirect(`${department}adddoc?amsg=${result}`);
        }
        else if (department==="judge"){
            result = await functions2.addDocument(userId, recordName,fileContentsJSON);
            return res.redirect(`${department}adddoc?amsg=${result}`);
        }
        else if(department==="client"){
            result = await functions1.addDocument(userId, recordName, fileContentsJSON);
            return res.redirect(`${department}adddoc?amsg=${result}`);
        }
    } catch (error) {
        console.error('Error in /adddoc:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/grantRecord', async (req, res) => {
    try {
        const { recordName, Password, username } = req.body;
        const userId = req.session.userId;
        const password = req.session.pass;
        const department = req.session.department;

        if (!userId) {
            return res.redirect('/login');
        }

        if (password !== Password) {
            return res.redirect(`${department}access?lmsg=Incorrect password`);
        }

        const result = await functions2.grantAccessToLegalRecord(userId, recordName, username);
        return res.redirect(`${department}access?lmsg=${result}`);
    } catch (error) {
        console.error('Error in /grantRecord:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/revokeRecord', async (req, res) => {
    try {
        const { recordName, Password, username } = req.body;
        const userId = req.session.userId;
        const password = req.session.pass;
        const department = req.session.department;

        if (!userId) {
            return res.redirect('/login');
        }

        if (password !== Password) {
            return res.redirect(`${department}revoke?rmsg=Incorrect password`);
        }

        const result = await functions2.revokeAccessToLegalRecord(userId, recordName, username);
        return res.redirect(`${department}revoke?rmsg=${result}`);
    } catch (error) {
        console.error('Error in /revokeRecord:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.post('/addjudgement', async (req, res) => {
    try {
        const { recordName, Password, judgement , status } = req.body;
        const userId = req.session.userId;
        const password = req.session.pass;
        const department = req.session.department;

        if (!userId) {
            return res.redirect('/login');
        }

        if (password !== Password) {
            return res.redirect(`judgement?jmsg=Incorrect password`);
        }

        const result1 = await functions2.addJudgmentToLegalRecord(userId, recordName, judgement);
        const result2 = await functions2.updateLegalRecordStatus(userId, recordName,status)
        return res.redirect(`judgement?jmsg=${result1}`);
    } catch (error) {
        console.error('Error in /revokeRecord:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/getuser', async (req, res) => {
    try {
        const { usertype, password } = req.query;
        const userId = req.session.userId;
        const pass = req.session.pass;
        const department = req.session.department;

        if (!userId) {
            return res.redirect('/login');
        }

        if (password !== pass) {
            return res.redirect(`adminusers?umsg=Incorrect password`);
        }

        let result;

        if (usertype === 'client') {
            result = await org1.getClientUsers();
        } else if (usertype === 'lawyer') {
            result = await org2.getLawyerUsers();
        } else {
            result = await org2.getJudgeUsers();
        }

        // Render the EJS template and pass the result object
        res.render('admindata1.ejs', { result });
    } catch (error) {
        console.error('Error in /getuser:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.get('/getRecord', async (req, res) => {
    try {
        const { password } = req.query;
        const userId = req.session.userId;
        const pass = req.session.pass;
        const department = req.session.department;

        if (!userId) {
            return res.redirect('/login');
        }

        if (password !== pass) {
            return res.redirect(`adminrecords?dmsg=Incorrect password`);
        }

        let result;

        result = await functions1.getAllLegalRecords('admin');
        const data = JSON.parse(result);
        req.session.data = data;
        // Render the EJS template and pass the result object
        res.render('admindata2.ejs', { data });
    } catch (error) {
        console.error('Error in /getuser:', error);
        res.status(500).render('error.ejs', { error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Port is listening on http://localhost:${port}`);
});

const isAuthenticated = (req, res, next) => {
    if (req.session.userId && req.session.pass && req.session.department) {
        // User is authenticated, proceed to the next middleware or route handler
        next();
    } else {
        // User is not authenticated, redirect to the login page
        res.redirect('/login');
    }
};

app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

app.use(['/admindash', '/adminlogs', '/adminnote', '/adminusers', '/adminrecords', '/lawyerdash', '/createform', '/readform', '/updateform', '/adddocform', '/access', '/revoke', '/viewform', '/judgedash'], isAuthenticated);

app.use((err, req, res, next) => {
    console.error('Error occurred:', err);
    res.status(500).render('error.ejs', { error: 'Internal Server Error' });
});

app.use(['/protected-route', '/other-protected-route'], isAuthenticated);

app.get('/logout', (req, res) => {
    // Destroy the session and redirect to the login page
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        // Set cache control headers to prevent caching of the logout page
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');

        // JavaScript script to prevent back navigation
        const script = `
            <script>
                if (window.history && window.history.pushState) {
                    window.history.pushState(null, null, window.location.href);
                    window.onpopstate = function () {
                        window.history.pushState(null, null, window.location.href);
                    };
                }
            </script>
        `;
        // Send the script and redirect to the login page
        res.send(script + '<meta http-equiv="refresh" content="0;url=/login">');
    });
});
