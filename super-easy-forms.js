//Import .env
require('dotenv').config();
//Import AWS SDK
var AWS = require('aws-sdk');
//SES
var ses = new AWS.SES({apiVersion: '2010-12-01'});
//Dynamo DB
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
//package to use the file system
var fs = require("fs");
// Package to open browser window
const open = require('open');
//package to use stdin/out
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
//Import the createLambda function
const createLambda = require('./create-lambda');

//converts console input to y and n
function convertInput(input) {
  var mininput =  input.toLowerCase()
  if (mininput == 'y' || mininput == 'yes') {
      output = 'y';
  }
  else if(mininput == 'n' || mininput == 'no') {
      output = 'n';
  }
  else {
      output = '';   
  }
  return output;
}

const super_easy_form =
`
MMMMMMMMMMMMMMMMMO'''''''''''''''''''''''''''''''''''''''''''OMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMO.  ,llllllllllllllllllllllllllllllllllc,  .OMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMO. .xMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMd. .OMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMO. .xMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWd. .OMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMk. .xMMMMNKKKKKKKKKKKKKKKKKKKKKKKKKNWMMWd. .OMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMWo  .xMMMNl.........................cXMMMd. .kMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMWk.  .xMMMNx:::::::::::::::::::::::::dNMMWd.  :KMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMM0,   .xMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMd.   lNMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMXc    .xMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMd.   .oWMMMMMMMMMMMMMMM
MMMMMMMMMMMMMWd.    .xMMMWNXXXXXXXXXXXXXXXXXXXXXXXXXNMMMMd.    .kWMMMMMMMMMMMMMM
MMMMMMMMMMMMWk.     .xMMMXc.........................dWMMMd.     'OMMMMMMMMMMMMMM
MMMMMMMMMMMMK;  ..  .xMMMXo;;;;;;;;;;;;;;;;;;;;;;;;;kWMMWd.  ..  ;KMMMMMMMMMMMMM
MMMMMMMMMMMNc   ''  .xMMMMWWWWWWWWWWWWWWWWWWWWWWWWWWWMMMWd.  ''.  cXMMMMMMMMMMMM
MMMMMMMMMMWd.  .;'  .xMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWd.  ';'  .oNMMMMMMMMMMM
MMMMMMMMMMO'  .;:'  .xMMMWX000000000000000000000000KNWMMWd.  ';;.  .xWMMMMMMMMMM
MMMMMMMMMK;  .,;;'  .xMMMX:.........................oNMMWd.  '::;.  .OWMMMMMMMMM
MMMMMMMMNl   ';:;'  .xMMMNxccccccccccccccccccccccccckWMMWd.  ':;;,.  ,0MMMMMMMMM
MMMMMMMWx.  .;;;;'  .xMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWd.  ':;:;,.  :XMMMMMMMM
MMMMMMMO'  .,;;;;'  .xMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWd.  ':;::;'   lNMMMMMMM
MMMMMMX:  .,;;;;:'  .xMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWd.  ';:;;;;.  .dWMMMMMM
MMMMMNl   ';;;;;;'  .xMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWd.  ';;;:;;;.  .kWMMMMM
MMMMWx.  .;;;;;;;'  .dWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWNd.  ':;;;;;;,.  'OMMMMM
MMMM0'  .,;;;;;;;'   .,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,.   ':;;;;;;;,.  ;KMMMM
MMMX:  .,;;;;;;:;,.                                        ..,;;;;;;;:;'.  cXMMM
MMNo.  ';;;;::;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:;;;;;;;;'  .oNMM
MWk.  .;;;;::;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::;;;;;;:;;;;;.  .xWM
M0,  .,;;;;;;;;;;;;;;;::;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;::;;:;;;:;;::;;;;'   'OW
Nl     ...'',;;;:;;;;;;:;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:;;;;;,,'...     .oN
W0xoc;..     ....''''''''''''''''''''''''''''''''''''''''''''''...     .';ldOKNW
MMMMMWXKOdl:,..                                                  .':ldOKNWMMMMMM
MMMMMMMMMMMMWX0kdlcllllllllllllllllllllllllllllllllllllllccclloxOKNWMMMMMMMMMMMM
MMMMMMWNXK0KKXNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMNx:'.',,'.'lXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMNl   c0XXk' ,KMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMK,   lXMMWk:dWWX0kxd0WMN0OxxkXMNKOkxxkKXOxdxOXMMMMMWKOxddxOXWMWX0kxdkNNOx0WMM
MMMNl    'lkXWWWMXd,   :NW0c.  .kW0l.   .,:;'.  'xNMWk;..,l:. .lKNk;.  .l;. ,0MM
MMMMNx,.    .:xXMMWo   cNMM0'  .kMMX;    ;0NNd.  .kWx.  ,KMWo   cNMk.  .;oddkXMM
MMMMMMN0d:.    ,OWWo   lNMM0'  .kMMX;  ..dWMMK;   oK;   .cll,   ;XMk.  .OMMMMMMM
MMMWOo0MMWXd'   :NWl   lNMM0'  .kMMX;  ..dWMMK;   oK;   'odddddd0WMk.  '0MMMMMMM
MMMX: cXMMMNc   cNWo   :XMWx.  .kMMX;  ..dWMWk.  'ONo   'kWMMMWWWMMO.  '0MMMMMMM
MMM0' .:odo;. .cKMM0,  .;lc:.   :ONX;   .;xko'  ,OWMXo.  .;cllcoKWKl.  .l0NMMMMM
MMMNOdlc:::clx0WMMMWKdc::lkKx:cldONX;   .,ccccoONMMMMWKxlc::clxXWNOolllllxXMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMX;  ..dWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMW0l.   .,xXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMXkkkkkkkONMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMWXOOOOOOOOOOOOOKWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMW0o'   .,;;;'. lNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMWd.  ,0WWW0;.dWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMWd.  ;KMMNK0OXMMN0xollccld0WMMMMNOolcclld00doooloOWWOoooo0WMMMMMMMMM
MMMMMMMMMMMMWd.  'x0k:,kMMMM0' .:xd;  .dXWMKc  .oxc. oKd'   ,0WW0, .oKWMMMMMMMMM
MMMMMMMMMMMMWd.  .';' .xMMMMNd,oXMMk.  ;OXM0'  .oKXdlKMMO,  .kWM0'.xWMMMMMMMMMMM
MMMMMMMMMMMMWd.  ,0NXo:OMMMMW0xoooo:   ;OXMWk;.  .,lONMMWO'  '0Xc.lNMMMMMMMMMMMM
MMMMMMMMMMMMWd.  ;KMMWNXk0WXl. .ckOl.  ;OXMMN0ko:.  .cKMMWO'  ;l.;KMMMMMMMMMMMMM
MMMMMMMMMMMMWd.  ;KWWWNl.;Kk.  .kWXl   ;OXMXc.oNW0,  .kMMMWO'   'OMMMMMMMMMMMMMM
MMMMMMMMMMW0o'   .,:::,. '0Kc.  .;c:.  .;cOk' .:oc. .oXMMMMWk. .dWMMMMMMMMMMMMMM
MMMMMMMMMMWKkxxkxxxxxxxxxONMN0xddxKXkodkk0NNKkxdodxOXWMMMMWWK; lNMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNd;,'.cXMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWx..,xNMMMMMMMMMMMMMMMMM
OoooooooooooodKMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
0l.   'cccc' .xMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MK,   dWMMM0;;0MMMMMWWNNNWMMMMMMMWWWNWMMWWWWMMWWNWMMWNNWMMMMWNNWMMMMMMMWWNNNWMMM
MK,   dWMMWNXXWMMNOo:;::;;cxKWMKo:,';kOl;,:kkc;,'cxo;'';oK0o;'',l0WMMXd:,;:;;:xN
MK,   c0K0l:OMMMK:. .dKKk,  .xNXx'   ','..,d0c.  .:dd,   'cdd;   ;KMX:  .xKx' lN
MK,   .,;'..kMMX:   lWMMMk.  .OMX;   :0NNNNWMx.  '0MMk.  .kMM0'  .kMX:   ;x0kxXM
MK,   lXXKdc0MM0'  .dWMMM0'  .dWX;  .dWMMMMMMx.  ,KMMO.  '0MMK,  .kMMKo'.  .,oKW
MK,   dWMMWWWMMK;   oWMMMO.  .kMX;  .dWMMMMMMx.  ,KMMO.  'OMMK,  .kMMXkOOd;.  'O
M0,   oNMMMMMMMWk.  'ONWXl  .lNMK;  .dWMMMMMWx.  ,KMMk.  .OMM0'  .xWX: ,0WX:  .x
kc....,lOWMMMMMMW0l,.':c;.'cONM0l'...;o0WMMNk;...'oXKc....c0Xo'...;kO:..,c;..;xN
XKKKKKKKNWMMMMMMMMMNX0OO0KNWMMMNKKKKKKKNMMMWXKKKKKXWNXKKKKKNNXKKKKKXWWXK0OO0XWMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
`;

//function that adds values to the variables.json file
function addVars(jsonVar, jsonVal){
  let rawdata = fs.readFileSync('variables.json');  
  obj = JSON.parse(rawdata);
  obj[jsonVar] = jsonVal;
  jsonObj = JSON.stringify(obj);
  fs.writeFileSync('variables.json', jsonObj);
  //console.log('\x1b[33m', 'Variable saved.', '\x1b[0m')
  return 'Success';
}

//function that validates an email using regex
function validate(email){
  if(/(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test(email)){
    return true;
  }
  else {
    return false;
  }
}

//function that verifies an email with AWS SES
async function verifyMail(senderEmail) {
  var params = {
      EmailAddress: senderEmail,
     };
     await ses.verifyEmailIdentity(params, function(err, data) {
       if (err) {
          console.log(err, err.stack);
          return false;
        }
       else  {
          addVars('source', senderEmail);
          stmt2(senderEmail);
       }             
  });
}

//create the IAM user
function init(){
  readline.question(`Have you already created the IAM user for Super Easy Forms? [Y/n] `, (res) => {
    switch(convertInput(res)) {
        case 'y':
            afterIam();
            break;
        case 'n':
            createIam();
        default:
            console.log('please enter a valid yes/no response');
            init();
      }
  });
}

function createIam() {
  readline.question(`Please enter the name of your IAM user `, (userName) => {
    if(/^[a-zA-Z0-9]*$/.test(userName)){
      console.log('please click on', "\x1b[44m", 'create user', "\x1b[0m");
      console.log("\x1b[32m", 'Then add the', "\x1b[0m", 'AWS_ACCESS_KEY_ID', "\x1b[32m", 'and', "\x1b[0m", 'AWS_SECRET_ACCESS_KEY', "\x1b[32m", 'env variables', "\x1b[0m");
      console.log("\x1b[32m", 'Dont forget the', "\x1b[0m", 'AWS_REGION', "\x1b[32m", 'and', "\x1b[0m", 'AWS_ACCOUNT_NUMBER');
      console.log("\x1b[32m", 'Your region has been set to the default', "\x1b[0m", 'us-east-1');
      (async () => {
        await open(`https://console.aws.amazon.com/iam/home?region=us-east-1#/users$new?step=review&accessKey&userNames=${userName}&permissionType=policies&policies=arn:aws:iam::aws:policy%2FAdministratorAccess`);
      })();
      afterIam();
    }
    else {
      console.log('\x1b[31m', 'Name invalid. Only alphanumeric characters. No spaces.', '\x1b[0m')
      createIam();
    }
  });
}

function afterIam(){
  readline.question(`Have you finished configuring the env variables? [Y/n] `, (res5) => {
    switch(convertInput(res5)) {
      case 'y':
        stmt1();
        break;
      default:
        console.log('please enter a valid yes/no response');
        afterIam();
    }
  });
}

//CLI statement 1
function stmt1(){
  readline.question(`Please enter the email address youd like to register with SES `, (res) => {
    if(validate(res)){
      console.log('You will shortly recieve an email from AWS. Please click on the verification link.');
      verifyMail(res)
    }    
    else {
      console.log('\x1b[31m', 'Enter a valid email address.', '\x1b[0m');
      stmt1(); 
    }  
  });
}

//CLI statement 2
function stmt2(){
  let rawdata = fs.readFileSync('variables.json');  
  obj = JSON.parse(rawdata);
  var email = obj.source;
  if(!email) {
    init();
  }
  else {
    console.log('\x1b[33m', email, '\x1b[0m');
    readline.question(`Have you already verified your email with SES? [Y/n] `, (res2) => {
        switch(convertInput(res2)) {
            case 'y':
                checkVerifiedEmail(email)
                break;
            case 'n':
                init();
                break;
            default:
                stmt1()
        }
    });
  }
}

//function that checks to see if the provided email has been verified by SES
function checkVerifiedEmail(email) {
  var params = {
    Identities: [
       email,
    ]
   };
   ses.getIdentityVerificationAttributes(params, function(err, data) {
     if (err) {
        console.log(err, err.stack);
     } 
     else {
       console.log()
        switch(data.VerificationAttributes[email].VerificationStatus) {
          case 'Success':
            //stmt4()
            console.log('\x1b[32m', 'The following email was succesfully verified with SES: ', email, '\x1b[0m');
            const sesArn = `arn:aws:ses:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_NUMBER}:identity/${email}`;
            addVars('emailArn', sesArn);
            createDB();
            break; 
          default:
            console.log('\x1b[31m', 'It appears your address still hasnt been verified... Lets try again.', '\x1b[0m');
            stmt2();
        }      
      } 
   });
}

//function that creates a Dynamo DB table
function createDB() {
  readline.question(`please enter the desired name for your contact form's data base table. It must be unique. `, (dbName) => {
      if(/^[a-zA-Z0-9]*$/.test(dbName)){
          addVars('table', dbName)
          var params = {
            AttributeDefinitions: [
              {
                  AttributeName: "id", 
                  AttributeType: "S"
              },
            ], 
            KeySchema: [
              {
              AttributeName: "id", 
              KeyType: "HASH"
            },
            ], 
            TableName: dbName,
            BillingMode: "PAY_PER_REQUEST",
          };
          dynamodb.createTable(params, function(err, data) {
            if(err){
              console.log(err, err.stack);
            }
            else  {
              const tableArn = data.TableDescription.TableArn;
              addVars('tableArn', tableArn);
              console.log('\x1b[32m', 'Succesfully created a Dynamo DB table w/ the name: ', dbName, '\x1b[0m')
              formFields(dbName, tableArn);
            }       
          });
      }
      else {
          console.log('\x1b[31m', 'Table name invalid. Only alphanumeric characters. No spaces.', '\x1b[0m');
          createDB();
      }
  });
    
}

//creates a JSON structure with the form fields provided by the user
function formFields(table){
  var x = readline.question(`Please enter your desired form fields sepparated by spaces `, (res) => {
    var response = res.split(" ");
    addVars('formFields', response);
    var jstring = `"id":"id",`;
    for(let r of response){
        jstring += `"${r}":"${r}",`;
    }
    var jsonstring = jstring.substring(0, (jstring.length -1))
    createLambda.script(jsonstring, table)
    readline.close();
  });
}

//welcome user
console.log('\x1b[33m', super_easy_form, '\x1b[0m');
//Execute the script.
stmt2();



