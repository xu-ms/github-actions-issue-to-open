const { includes } = require("resium");

const first_filter_comb = ["safety", "security", "concern"];
const second_filter_comb = ["data", "password", "profile"];
const filter_kw = "privacy";


const env = process.env;
const env_title = env.title
const env_body = env.body
const env_time = env.created_at
const env_url = env.html_url

console.log("Issue Title: " + env_title + "\n" + "Issue Body: " + env_body + "\n" + "Issue Creation Time: " + env_time + "\n" + "Issue URL: " + env_url + "\n")
if (env_title.includes(filter_kw) || env_body.includes(filter_kw))
{
    console.log("Issue needs Attention!" + "\n","Issue Title: " + env_title +"(" + env_url + ")" + "\n","Creation Time: " + env_time + "\n" )
}

for (let item1 of first_filter_comb) {
    for (let item2 of second_filter_comb) {
        if ((env_title.includes(item1) && env_title.includes(item2)) || 
        (env_body.includes(item1) && env_body.includes(item2)))
        {
            console.log("Issue needs Attention!" + "\n","Issue Title: " + env_title +"(" + env_url + ")" + "\n","Creation Time: " + env_time + "\n" )
        }
    }
};

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