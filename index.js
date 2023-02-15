const { includes } = require("resium");
const core = require('@actions/core');
const github = require('@actions/github');
const nodemailer = require('nodemailer');

const first_filter_comb = ["safty", "security", "concern"];
const second_filter_comb = ["data", "password", "profile"];
const filter_kw = "privacy";
const issue = github.context.payload.issue;
const email_password = core.getInput('email_password');

core.debug(issue)

main()

function main(){
    var need_attention = false;
    try{
        if (issue?.title?.includes(filter_kw) || issue?.body?.includes(filter_kw))
        {
            setOutput();
            need_attention = true;
        }
        else{
            for (let item1 of first_filter_comb) {
                for (let item2 of second_filter_comb) {
                    if ((issue?.title?.includes(item1) && issue?.title?.includes(item2)) || 
                    (issue?.body?.includes(item1) && issue?.body?.includes(item2)))
                    {
                        setOutput();
                        need_attention = true;
                        break;
                    }
                }
                if (need_attention){
                    break;
                }
            };
        }
        if (!need_attention){
            core.setOutput("need_attention", 'false');
        }
    }
    catch(err){
        core.error(`Error ${err}`);
    }
}

function setOutput() {
    var data ={
        "title":"privacy",
        "issueName":issue.title,
        "issueLink":issue.html_url,
        "issueNumber":issue.number,
        "issueCreateTime":issue.created_at
    }
    var jsonData = JSON.stringify(data);
    core.setOutput("need_attention", 'true');
    core.setOutput("issue_info", jsonData);
    core.warning("Alarm: new high priority issue need to look into!\n" + issue.html_url)
    sendMail()
}

function sendMail(){

    let transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
        user: 'autodigectbot@outlook.com', 
        pass: email_password
        }
    });

    const emailContent = `
    <html>
        <body style="background-color:grey">
            <table align="center" border="0" cellpadding="0" cellspacing="0"
                width="550" bgcolor="white" style="border:2px solid black">
                <tbody>
                    <tr>
                        <td align="center">
                            <table align="center" border="0" cellpadding="0" 
                                cellspacing="0" class="col-550" width="550">
                                <tbody>
                                    <tr>
                                        <td align="center" style="background-color: #188cd9;;
                                                height: 50px;">
                                            <a href="#" style="text-decoration: none;">
                                                <p style="color:white;
                                                        font-weight:bold; font-size: 18px">
                                                    GitHub Auto-Digest Bot
                                                </p>
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr style="height: 300px;">
                        <td align="center" style="border: none;
                                border-bottom: 2px solid #188cd9; 
                                padding-right: 20px;padding-left:20px">
        
                            <p style="font-weight: bolder;font-size: 42px;
                                    letter-spacing: 0.025em;
                                    color:red" class="small">
                                    Alarm!
                            </p>
                            <p style="font-weight: bolder;font-size: 36px;
                                    letter-spacing: 0.025em;
                                    color:black" class="small">
                                    New high priority issue need to look into!
                            </p>
                        </td>
                    </tr>
        
                    <tr style="display: inline-block;">
                        <td style="height: 150px;
                                padding: 20px;
                                border: none; 
                                border-bottom: 2px solid #361B0E;
                                background-color: white;">
                            
                            <h2 style="text-align: left; align-items: center;">
                                Issue Title: ${issue.title}
                            </h2>
                            <p class="data" 
                                style="text-align: justify-all;
                                align-items: center; 
                                font-size: 15px;
                                padding-bottom: 12px;">
                                Issue Number: ${issue.number}
                            </p>
                            <p class="data" 
                                style="text-align: justify-all;
                                align-items: center; 
                                font-size: 15px;
                                padding-bottom: 12px;">
                                Issue Create Time: ${issue.created_at}
                            </p>
                            <p>
                                <a href="${issue.html_url}"
                                style="text-decoration: none; 
                                        color:black; 
                                        border: 2px solid #188cd9; 
                                        padding: 10px 30px;
                                        font-weight: bold;"> 
                                View Issue 
                                </a>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>
    </html>
    `

    let mailOptions = {
        from: 'autodigectbot@outlook.com', 
        to: 'sunelyssa@microsoft.com', 
        subject: 'Alarm: new high priority issue need to look into!',
        //text: `issue title:${issue.title}` + `\n` +`issue link:${issue.html_url}` + `\n` + `issue number:${issue.number}` + `\n` +`issue create time:${issue.created_at}`
        html: emailContent
    };
    
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
  
}
