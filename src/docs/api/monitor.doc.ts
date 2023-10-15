export const createMonitor = {
  tags: ["Monitor"],
  description: "Endpoint for creating a monitor.",
  operationId: "createMonitor",
  consumes: ["application/json"],
  produces: ["application/json"],
  parameters: [
    {
      in: "body",
      name: "body",
      description: "Monitor object",
      required: true,
      schema: {
        $ref: "#/components/schemas/createMonitorBody",
      },
    },
  ]
  // requestBody: {
  //   content: {
  //     "application/json": {
  //       schema: {
  //         $ref: "#/components/schemas/Monitor",
  //       },
  //     },
  //   },
  // },
};

export const createMonitorBody = {
  type: "object",
  schema: {
    projectId: {
      type: String,
      example: '123'
    },
    url: {
      type: String,
      example: "http://www.example.com",
    },
    users: [
      {
        userId: {
          type: String,
          example: '456'
        },
        email: {
          type: String,
          example: "user@example.com"
        },
      },
    ],
    statusCode: {
      type: Number,
      default: 200,
      example: 200
    },
    title: {
      type: String,
      example: "Example.com",
    },
  },
};

export const monitorBody = {
  projectId: 0,
  url: "http://www.example.com",
  users: [],
  statusCode: 200,
  active: true,
  title: "Example",
  online: true,
  _id: "5f9b0b0b9b9b9b9b9b9b9b9b",
  __v: 0,
};

// module.exports = {createMonitor, createMonitorBody, monitorBody}
