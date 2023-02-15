const { includes } = require("resium");
const core = require('@actions/core');
const github = require('@actions/github');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
console.log(__dirname);



const first_filter_comb = ["safty", "security", "concern"];
const second_filter_comb = ["data", "password", "profile"];
const filter_kw = "privacy";
const issue = github.context.payload.issue;
const email_password = core.getInput('EMAIL_PASSWORD');

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
    sendMail();
}

function sendMail(){

    
    let transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
        user: 'zhangxu2022@outlook.com', 
        pass: email_password
        }
    });
    
    let mailOptions = {
        from: 'zhangxu2022@outlook.com', 
        to: 'xuzhang4@microsoft.com', 
        subject: 'Alarm: new high priority issue need to look into!',
        text: `issue link:${issue.html_url}` + `issue number:${issue.number}` + `issue create time:${issue.created_at}` + `issue title:${issue.title}`
    };
    
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
  
}

