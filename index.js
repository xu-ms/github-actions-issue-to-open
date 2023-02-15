const { includes } = require("resium");
const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');
console.log(__dirname);


fs.readdir('.', (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('当前目录中的文件有：');
  files.forEach(file => {
    console.log(file);
  });
});


//const jsonPath = path.join(__dirname, '..', '.github', 'keywork_list.json');
//const jsonData = fs.readFileSync(jsonPath, 'utf8');
//const KeyWords_List = JSON.parse(jsonData);

const KeyWords_List = {
    "first_filter_comb": ["safty", "security", "concern"],
    "second_filter_comb": ["data", "password", "profile"],
    "filter_kw": "privacy"
};
const first_filter_comb = KeyWords_List.first_filter_comb;
const second_filter_comb = KeyWords_List.second_filter_comb;
const filter_kw = KeyWords_List.filter_kw;
const issue = github.context.payload.issue;

main()

function main(){
    var need_attention = false;
    try{
        if (issue.title.includes(filter_kw) || issue.body.includes(filter_kw))
        {
            setOutput();
            need_attention = true;
        }
        else{
            for (let item1 of first_filter_comb) {
                for (let item2 of second_filter_comb) {
                    if ((issue.title.includes(item1) && issue.title.includes(item2)) || 
                    (issue.body.includes(item1) && issue.body.includes(item2)))
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
            console.log("No Need Attention")
            core.setOutput("need_attention", 'false');
        }
    }
    catch(err){
        console.log("Filter Fails" + err.message)
    }
}

function setOutput() {
    var data ={
        "title":"privacy",
        "issueName":issue.title,
        "issueLink":issue.url,
        "issueNumber":issue.number,
        "issueCreateTime":issue.time
    }
    var jsonData = JSON.stringify(data);
    core.setOutput("need_attention", 'true');
    console.log("Need Attention")
    core.setOutput("issue_info", jsonData);
}