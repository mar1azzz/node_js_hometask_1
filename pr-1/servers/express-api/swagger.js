/**
 * Swagger/OpenAPI specification for Students Management API.
 * This file exports a JS object that is consumed by swagger-ui-express.
 */

module.exports = {
  openapi: "3.0.0",

  info: {
    title: "Students Management System API",
    version: "2.0.0",
    description: `
Students Management System with authentication and role-based access control.

Roles:
- student — minimal access, can view own grades
- teacher — can manage students and assign grades
- admin — full access to all system operations
`,
  },

  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
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

  tags: [
    { name: "Auth", description: "Authentication and authorization" },
    { name: "Students", description: "Students management" },
    { name: "Subjects", description: "University subjects catalog" },
    { name: "Grades", description: "Student grades" },
    { name: "Backup", description: "Backup subsystem (admin only)" },
    { name: "Monitoring", description: "Server monitoring and metrics" },
  ],

  paths: {
    // =========================
    // AUTH
    // =========================
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register new user",
        description:
          "Public endpoint. Registers a new user. If role=student, also creates a student profile.",
        security: [],
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
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                  roleName: {
                    type: "string",
                    description: "student | teacher | admin",
                  },
                  age: {
                    type: "number",
                    description: "Only for role=student",
                  },
                  group: {
                    type: "string",
                    description: "Only for role=student",
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
        tags: ["Auth"],
        summary: "Login and receive JWT",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "JWT issued" },
          401: { description: "Invalid credentials" },
        },
      },
    },

    // =========================
    // MONITORING
    // =========================
    "/status": {
      get: {
        tags: ["Monitoring"],
        summary: "Server monitoring dashboard",
        description: "Displays server metrics (CPU, memory, requests).",
        responses: {
          200: {
            description: "Monitoring dashboard HTML page",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden",
          },
        },
      },
    },

    // =========================
    // STUDENTS
    // =========================
    "/api/students": {
      get: {
        tags: ["Students"],
        summary: "Get all students",
        description: "Roles: student, teacher, admin",
        responses: { 200: { description: "Students list" } },
      },
    },

    "/api/students/{id}": {
      get: {
        tags: ["Students"],
        summary: "Get student by ID",
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { 200: {}, 404: {} },
      },
      patch: {
        tags: ["Students"],
        summary: "Update student",
        description: "Roles: teacher, admin",
        parameters: [{ name: "id", in: "path", required: true }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  age: { type: "number" },
                  group: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: {}, 404: {} },
      },
      delete: {
        tags: ["Students"],
        summary: "Delete student",
        description: "Role: admin",
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { 200: {}, 404: {} },
      },
    },

    "/api/students/group/{id}": {
      get: {
        tags: ["Students"],
        summary: "Get students by group",
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { 200: {} },
      },
    },

    "/api/students/average-age": {
      get: {
        tags: ["Students"],
        summary: "Get average age",
        responses: { 200: {} },
      },
    },

    // =========================
    // SUBJECTS
    // =========================
    "/api/subjects": {
      get: {
        tags: ["Subjects"],
        summary: "Get subjects",
        responses: { 200: {} },
      },
      post: {
        tags: ["Subjects"],
        summary: "Create subject",
        description: "Role: admin",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["subjectName"],
                properties: {
                  subjectName: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 201: {} },
      },
    },

    "/api/subjects/{id}": {
      delete: {
        tags: ["Subjects"],
        summary: "Delete subject",
        description: "Role: admin",
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { 200: {}, 404: {} },
      },
    },

    // =========================
    // GRADES
    // =========================
    "/api/grades": {
      post: {
        tags: ["Grades"],
        summary: "Assign grade",
        description: "Roles: teacher, admin",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["studentId", "subjectId", "grade"],
                properties: {
                  studentId: { type: "string" },
                  subjectId: { type: "string" },
                  grade: { type: "number" },
                },
              },
            },
          },
        },
        responses: { 201: {} },
      },
    },

    "/api/grades/my": {
      get: {
        tags: ["Grades"],
        summary: "Get my grades",
        description: "Role: student",
        responses: { 200: {} },
      },
    },

    "/api/grades/student/{id}": {
      get: {
        tags: ["Grades"],
        summary: "Get grades by student",
        description: "Roles: teacher, admin",
        parameters: [{ name: "id", in: "path", required: true }],
        responses: { 200: {} },
      },
    },

    // =========================
    // BACKUP
    // =========================
    "/api/backup/start": {
      post: {
        tags: ["Backup"],
        summary: "Start backup",
        description: "Role: admin",
        responses: { 200: {}, 409: {} },
      },
    },
    "/api/backup/stop": {
      post: {
        tags: ["Backup"],
        summary: "Stop backup",
        description: "Role: admin",
        responses: { 200: {}, 409: {} },
      },
    },
    "/api/backup/status": {
      get: {
        tags: ["Backup"],
        summary: "Backup status",
        description: "Role: admin",
        responses: { 200: {} },
      },
    },
    "/api/backup/report": {
      get: {
        tags: ["Backup"],
        summary: "Backup report",
        description: "Role: admin",
        responses: { 200: {} },
      },
    },
  },
};
