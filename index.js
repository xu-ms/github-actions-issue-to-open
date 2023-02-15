
const { includes } = require("resium");
const core = require('@actions/core');
const github = require('@actions/github');

const first_filter_comb = ["safety", "security", "concern"];
const second_filter_comb = ["data", "password", "profile"];
const filter_kw = "privacy";


const env = process.env;
console.log(env)
const env_title = env.title
const env_body = env.body
const env_time = env.created_at
const env_url = env.html_url
const env_number = env.number

console.log("env:" + env.env_issue)
console.log(env.string_issue)

console.log("github:" + github)
console.log(github.context)
console.log(github.context.payload)
console.log(JSON.stringify(github.context.payload, undefined, 2))



main()

function main(){
    var need_attention = false;
    if (env_title.includes(filter_kw) || env_body.includes(filter_kw))
    {
        setOutput();
        need_attention = true;
    }
    else{
        for (let item1 of first_filter_comb) {
            for (let item2 of second_filter_comb) {
                if ((env_title.includes(item1) && env_title.includes(item2)) || 
                (env_body.includes(item1) && env_body.includes(item2)))
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

function setOutput() {
    var data ={
        "title":"privacy",
        "issueName":env_title,
        "issueLink":env_url,
        "issueNumber":env_number,
        "issueCreateTime":env_time
    }
    var jsonData = JSON.stringify(data);
    core.setOutput("need_attention", 'true');
    console.log("Need Attention")
    core.setOutput("issue_info", jsonData);
}






// fetch(url)
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);
//     const openIssues = data.filter(issue => !issue.closed_at);
//     const filteredIssues = openIssues.filter(issue => checkCombinationInIssue(issue, first_filter_comb, second_filter_comb));
//     console.log("Filtered Issues:");
//     filteredIssues.forEach(issue => {
//         console.log("- ${issue.title}")
//     })

//   })
//   .catch(error => {
//     console.error(error);
//   });