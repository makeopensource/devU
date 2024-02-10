import swaggerJSDoc from 'swagger-jsdoc'

const swaggerOptioner = {
  definition: {
      openapi: '3.0.0',
    info: {
      title: 'DevU API Documentation',
      version: '1.0.0',
      description: 'Example API documentation',
      contact: {
        name: 'The Daves',
        url: 'https://static.wikia.nocookie.net/donkeykong/images/2/28/Donkey_Kong.jpg/revision/latest?cb=20080919234913',
      },
    },
    components: {
      securitySchemas: {
        Authorization: {
          type: 'http',
          scheme: 'bearer',
          //value: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNrMDcxMTIwMjEifQ.eyJ1c2VySWQiOjMsImlzUmVmcmVzaFRva2VuIjp0cnVlLCJpYXQiOjE3MDczNjI3MDEsImV4cCI6MTcwODIyNjcwMSwiYXVkIjpbImRldlUtYXBpIiwiZGV2VS1jbGllbnQiXSwiaXNzIjoiZGV2VS1hdXRoIiwic3ViIjoiMyJ9.keUclDZXPaqn9-AWV3Vx1BmhN4IgC21VUfSe64xSAOxpYBejYI3OW9_0mC_2LPUz122WRKzLPq7F87z58GLL5BZ11kHCbBL1gAToVlfNig1sQFHUh3HP0NPe5If0xIZEpeG-fJsgbCfBjxTRnLOgsQgDBTrCz5fZHWPRLk0VT_NVtZc6ReCpatX6H4eeLxybY5GSJcPu-GyHETbNnwtt5TRMFsaaEXzPsACzI3LGSurXKNmiAnnG7nm04s1Y3aVIk67YLL1DxmvZFj-u5t9Il7HCFCLTNAyMZIicDBwaa0K5FjG3DF_ufM8Zrvq-uM8y1j-eY1RCyrYW1wGfLjdhmsKh2F5mhuBxk7DLmdS4GCXPekphFtH1Y0uN6CQM4_8tvbNX0v3BzG3FEeLoF4j5WmZa8DmT-QXs4PxtloCCNw9NFbXqATN684FnG5U7BiZVij4mG81Rfn990GDzmEd4BEOMn8mwXeG1-k0YCMU0I5lXkSlRO-M_n030M1dNyPnb',
          name: 'authorization',
          //in: 'cookie',
        }
      }
    },
    security: [{
      Authorization: [],
    }],
  },
  apis: [
    './src/*/*.router.ts'],
}

//const jsDocOptions = { swaggerDefinition: swaggerOptioner}
const swaggerSpec = swaggerJSDoc(swaggerOptioner)

export default swaggerSpec
