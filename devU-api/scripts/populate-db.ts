const API_URL = "http://localhost:3001"
const TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNrMDcxMTIwMjEifQ.eyJ1c2VySWQiOjMsImlzUmVmcmVzaFRva2VuIjp0cnVlLCJpYXQiOjE3MDczNjI3MDEsImV4cCI6MTcwODIyNjcwMSwiYXVkIjpbImRldlUtYXBpIiwiZGV2VS1jbGllbnQiXSwiaXNzIjoiZGV2VS1hdXRoIiwic3ViIjoiMyJ9.keUclDZXPaqn9-AWV3Vx1BmhN4IgC21VUfSe64xSAOxpYBejYI3OW9_0mC_2LPUz122WRKzLPq7F87z58GLL5BZ11kHCbBL1gAToVlfNig1sQFHUh3HP0NPe5If0xIZEpeG-fJsgbCfBjxTRnLOgsQgDBTrCz5fZHWPRLk0VT_NVtZc6ReCpatX6H4eeLxybY5GSJcPu-GyHETbNnwtt5TRMFsaaEXzPsACzI3LGSurXKNmiAnnG7nm04s1Y3aVIk67YLL1DxmvZFj-u5t9Il7HCFCLTNAyMZIicDBwaa0K5FjG3DF_ufM8Zrvq-uM8y1j-eY1RCyrYW1wGfLjdhmsKh2F5mhuBxk7DLmdS4GCXPekphFtH1Y0uN6CQM4_8tvbNX0v3BzG3FEeLoF4j5WmZa8DmT-QXs4PxtloCCNw9NFbXqATN684FnG5U7BiZVij4mG81Rfn990GDzmEd4BEOMn8mwXeG1-k0YCMU0I5lXkSlRO-M_n030M1dNyPnb"

//Returns the ID of the newly created entry
async function SendPOST(path: string, requestBody: string) {
    let response = await fetch(API_URL + path, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + TOKEN,
            "Content-Type": "application/json"
        },
        body: requestBody
    })
    if (response.status >= 400) {
        throw new Error("400/500 Level HTTP Response Recieved")
    } else {
        const responseId = await response.json()
        return responseId.id
    }
}

async function RunRequests() {
    try {
        //Users
        const userBilly = await SendPOST("/users", JSON.stringify({
            email: "billy@buffalo.edu", externalId: "billy", preferredName: "Billiam"
        }))
        const userBob = await SendPOST("/users", JSON.stringify({
            email: "bob@buffalo.edu", externalId: "bob", preferredName: "Bobby"
        }))
        const userJones = await SendPOST("/users", JSON.stringify({
            email: "jones@buffalo.edu", externalId: "jones", preferredName: "Jones"
        }))

        //Courses
        const course312 = await SendPOST("/courses", JSON.stringify({
            name: "Web Applications", semester: "f2023", number: "CSE312", startDate: "2023-08-31", endDate: "2023-12-10"
        }))
        const course302 = await SendPOST("/courses", JSON.stringify({
            name: "Intro to Experiential Learning", semester: "s2024", number: "CSE302", startDate: "2024-01-24", endDate: "2024-05-07"
        }))

        
        
        
    } catch (e) {
        console.error(e)
    }
    
}

RunRequests()

