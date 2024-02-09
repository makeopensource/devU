import swaggerJSDoc from 'swagger-jsdoc'

const swaggerOptioner = {
  openapi: '3.0.0',
  info: {
    title: 'Typescript Example Docs',
    version: '1.0.0',
    description: 'Example API documentation',
    contact: {
      name: 'The Daves',
      url: 'https://static.wikia.nocookie.net/donkeykong/images/2/28/Donkey_Kong.jpg/revision/latest?cb=20080919234913',
    },
  },
}

const jsDocOptions = { swaggerDefinition: swaggerOptioner, apis: ['./src/router/*.ts', './src/course/course.router.ts'] } //Add routers to this, I think?
const swaggerSpec = swaggerJSDoc(jsDocOptions)

export default swaggerSpec
