/**
 * Swagger/OpenAPI specification for Students Management API.
 * This file exports a JS object that is consumed by swagger-ui-express.
 */

module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Students Management System API",
    version: "1.0.0",
    description:
      "HTTP API for Students Management System (Labs 1–3). Includes student CRUD, backup controls, and reporting.",
  },

  servers: [
    {
      url: "http://localhost:3000",
      description: "Local server",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],

  paths: {
    // -------------------------
    // AUTH
    // -------------------------
    "/api/auth/register": {
      post: {
        summary: "Register new user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "surname", "email", "password"],
                properties: {
                  name: { type: "string" },
                  surname: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string", minLength: 6 },
                  roleName: {
                    type: "string",
                    description: "Optional. For testing/admin use.",
                  },
                  age: {
                    type: "number",
                    description: "Student age (only for role=student)",
                  },
                  group: {
                    type: "string",
                    description: "Student group (only for role=student)",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered" },
          400: { description: "Validation error" },
          409: { description: "Email already exists" },
        },
      },
    },

    "/api/auth/login": {
      post: {
        summary: "Login user and issue JWT token",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "JWT issued" },
          400: { description: "Validation error" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    // -------------------------
    // STUDENTS
    // -------------------------
    "/api/students": {
      get: {
        summary: "Get all students",
        tags: ["Students"],
        responses: {
          200: {
            description: "List of students",
          },
        },
      },
      post: {
        summary: "Create new student",
        tags: ["Students"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "age", "group"],
                properties: {
                  name: { type: "string" },
                  age: { type: "number" },
                  group: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Student created" },
          400: { description: "Validation error" },
        },
      },
      put: {
        summary: "Replace entire students collection",
        tags: ["Students"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "array" },
            },
          },
        },
        responses: {
          200: { description: "Collection replaced" },
        },
      },
    },

    "/api/students/{id}": {
      get: {
        summary: "Get student by ID",
        tags: ["Students"],
        parameters: [{ name: "id", in: "path", required: true }],
        responses: {
          200: { description: "Student found" },
          404: { description: "Not found" },
        },
      },
      patch: {
        summary: "Update student by ID",
        tags: ["Students"],
        parameters: [{ name: "id", in: "path", required: true }],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: { type: "object" },
            },
          },
        },
        responses: {
          200: { description: "Student updated" },
          404: { description: "Not found" },
        },
      },
      delete: {
        summary: "Delete student by ID",
        tags: ["Students"],
        parameters: [{ name: "id", in: "path", required: true }],
        responses: {
          200: { description: "Deleted" },
          404: { description: "Not found" },
        },
      },
    },

    "/api/students/group/{id}": {
      get: {
        summary: "Get students by group",
        tags: ["Students"],
        parameters: [{ name: "id", in: "path", required: true }],
        responses: {
          200: { description: "Group result" },
        },
      },
    },

    "/api/students/average-age": {
      get: {
        summary: "Get average age",
        tags: ["Students"],
        responses: {
          200: { description: "Average age returned" },
        },
      },
    },

    // -------------------------
    // BACKUP ENDPOINTS
    // -------------------------
    "/api/backup/start": {
      post: {
        summary: "Start backup mechanism",
        tags: ["Backup"],
        responses: {
          200: { description: "Started" },
          409: { description: "Already running" },
        },
      },
    },

    "/api/backup/stop": {
      post: {
        summary: "Stop backup mechanism",
        tags: ["Backup"],
        responses: {
          200: { description: "Stopped" },
          409: { description: "Not running" },
        },
      },
    },

    "/api/backup/status": {
      get: {
        summary: "Get backup status",
        tags: ["Backup"],
        responses: {
          200: { description: "Backup status" },
        },
      },
    },

    "/api/backup/report": {
      get: {
        summary: "Get backup summary report",
        tags: ["Backup"],
        responses: {
          200: { description: "Report returned" },
        },
      },
    },
  },
};
