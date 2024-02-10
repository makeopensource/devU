import swaggerJSDoc from 'swagger-jsdoc'

const swaggerOptioner = {
  definition: {
      openapi: '3.0.0',
    info: {
      title: 'DevU API Documentation',
      version: '1.0.0',
      description: 'Example API documentation',
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: 'http',
          scheme: 'bearer',
          name: 'authorization',
        }
      }
    },
    security: [{
      Authorization: [],
    }],
  },
  apis: [
    './src/router/*.ts', './src/*/*.router.ts', './src/*/*.model.ts'],
}

//const jsDocOptions = { swaggerDefinition: swaggerOptioner}
const swaggerSpec = swaggerJSDoc(swaggerOptioner)

export default swaggerSpec
