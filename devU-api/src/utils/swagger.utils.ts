import swaggerJSDoc from 'swagger-jsdoc'

const swaggerOptioner = {
  definition: {
      openapi: '3.0.0',
    info: {
      title: 'DevU API Documentation',
      version: '1.0.0',
      description: '',
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

const swaggerSpec = swaggerJSDoc(swaggerOptioner)

export default swaggerSpec
