const API_URL = 'http://localhost:3001'
const TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNrMDcxMTIwMjEifQ.eyJ1c2VySWQiOjMsImlzUmVmcmVzaFRva2VuIjp0cnVlLCJpYXQiOjE3MDczNjI3MDEsImV4cCI6MTcwODIyNjcwMSwiYXVkIjpbImRldlUtYXBpIiwiZGV2VS1jbGllbnQiXSwiaXNzIjoiZGV2VS1hdXRoIiwic3ViIjoiMyJ9.keUclDZXPaqn9-AWV3Vx1BmhN4IgC21VUfSe64xSAOxpYBejYI3OW9_0mC_2LPUz122WRKzLPq7F87z58GLL5BZ11kHCbBL1gAToVlfNig1sQFHUh3HP0NPe5If0xIZEpeG-fJsgbCfBjxTRnLOgsQgDBTrCz5fZHWPRLk0VT_NVtZc6ReCpatX6H4eeLxybY5GSJcPu-GyHETbNnwtt5TRMFsaaEXzPsACzI3LGSurXKNmiAnnG7nm04s1Y3aVIk67YLL1DxmvZFj-u5t9Il7HCFCLTNAyMZIicDBwaa0K5FjG3DF_ufM8Zrvq-uM8y1j-eY1RCyrYW1wGfLjdhmsKh2F5mhuBxk7DLmdS4GCXPekphFtH1Y0uN6CQM4_8tvbNX0v3BzG3FEeLoF4j5WmZa8DmT-QXs4PxtloCCNw9NFbXqATN684FnG5U7BiZVij4mG81Rfn990GDzmEd4BEOMn8mwXeG1-k0YCMU0I5lXkSlRO-M_n030M1dNyPnb"

// const rl = ReadLine.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })
// rl.setPrompt("Enter Authentication Token: ")
// const authToken = rl.prompt() // this aint working lmao

// rl.question("Enter Authentication Token: ", (authToken)) {
//     var authToken = "hi"
// }
// async function getToken() {
//     let tokenResponse = await fetch(API_URL + '/login/developer', {
//         method: 'POST',
//         credentials: "include",
//         body: JSON.stringify({email: 'dev@buffalo.edu', externalId: 'dev'})
//     })
//     return tokenResponse
// }

// async function printToken() {
//     let authToken = await getToken()
//     console.log(authToken.headers)
//     console.log(authToken.headers.get('Set-Cookie'))
// }

// printToken()

async function SendPOST(path: string, body: string) {
    let response = await fetch(API_URL + path, {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + TOKEN,
            "Content-Type": "application/json"
        },
        body: body
    })
    console.log(response.status)
}

SendPOST('/courses', JSON.stringify({
    name: 'EVIL Web Applications', "semester": 's2024', number: 'CSE312', startDate: '2024-01-24', endDate: '2024-05-12'
}))

// async function testget() {
//     let response = await fetch(API_URL + '/courses', {
//         method: 'POST',
//         headers: {
//             "Authorization": "Bearer " + TOKEN,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({name: 'Web Applications', "semester": 's2024', number: 'CSE312', startDate: '2024-01-24', endDate: '2024-05-12'})
//     })
// }

// testget()

