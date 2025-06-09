const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

/**
 * Swagger/OpenAPI Configuration for Hack The World API
 * Cybersecurity-themed documentation with interactive examples
 */

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🚀 Hack The World API",
      version: "1.0.0",
      description: `
# 🛡️ Cybersecurity Learning Platform API

Welcome to the **Hack The World** API documentation - your gateway to the most comprehensive cybersecurity learning platform.

## 🎯 Platform Overview

This API powers a three-phase cybersecurity learning system:
- **🟢 Beginner Phase**: Foundation building with 5 core modules
- **🟡 Intermediate Phase**: Advanced techniques with 5 specialized modules
- **🔴 Advanced Phase**: Expert-level challenges with 5 mastery modules

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive data validation and sanitization
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers for enhanced protection

## 🎮 Interactive Components

- **Terminal Emulation**: Real cybersecurity tools simulation
- **Hands-on Labs**: Step-by-step guided exercises
- **Security Games**: Gamified learning with scoring system
- **Achievement System**: Progress tracking and badges
- **Real-time Progress**: Live analytics and learning metrics

## 🚀 Getting Started

1. **Register** a new account via \`/api/auth/register\`
2. **Login** to receive your JWT token via \`/api/auth/login\`
3. **Explore** available phases and modules via \`/api/phases\`
4. **Enroll** in courses and start your cybersecurity journey!

## 💡 Try It Out

Use the **"Try it out"** button on any endpoint below to interact with live data!
      `,
      contact: {
        name: "Hack The World Team",
        email: "support@hacktheworld.dev",
        url: "https://hacktheworld.dev",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || "http://localhost:5001/api",
        description: "Development Server",
      },
      {
        url: "https://api.hacktheworld.dev/api",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token (obtainable via /auth/login)",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "507f1f77bcf86cd799439011",
            },
            username: {
              type: "string",
              example: "cyberhacker2024",
              minLength: 3,
              maxLength: 20,
            },
            email: {
              type: "string",
              format: "email",
              example: "hacker@terminal-hacks.space",
            },
            role: {
              type: "string",
              enum: ["user", "admin", "instructor"],
              example: "user",
            },
            level: {
              type: "number",
              example: 1,
              minimum: 1,
            },
            experience: {
              type: "number",
              example: 250,
              minimum: 0,
            },
            enrolledModules: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["cryptography-basics", "network-security"],
            },
            achievements: {
              type: "array",
              items: {
                type: "string",
              },
              example: ["first-login", "cipher-master"],
            },
            progress: {
              type: "object",
              properties: {
                completedLabs: { type: "number", example: 5 },
                completedGames: { type: "number", example: 3 },
                totalScore: { type: "number", example: 1250 },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00Z",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Authentication failed",
            },
            error: {
              type: "string",
              example: "Invalid credentials provided",
            },
            statusCode: {
              type: "number",
              example: 401,
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
            data: {
              type: "object",
              description: "Response data varies by endpoint",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js", "./src/models/*.js"],
};

const specs = swaggerJsdoc(options);

// Custom CSS for lightweight cybersecurity theme
const customCss = `
  .swagger-ui .topbar {
    background: #1a1a1a;
    border-bottom: 1px solid #00ff00;
  }
  .swagger-ui .topbar .download-url-wrapper {
    display: none;
  }
  .swagger-ui .info {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    color: #212529;
  }
  .swagger-ui .info h1 {
    color: #28a745;
    font-weight: 600;
  }
  .swagger-ui .info h2 {
    color: #495057;
    font-weight: 500;
  }
  .swagger-ui .info p, .swagger-ui .info li {
    color: #6c757d;
    line-height: 1.6;
  }
  .swagger-ui .info code {
    background: #f1f3f4;
    color: #d73a49;
    padding: 2px 4px;
    border-radius: 3px;
    font-size: 0.9em;
  }
  .swagger-ui .scheme-container {
    background: #ffffff;
    border: 1px solid #dee2e6;
    padding: 15px;
    border-radius: 5px;
    margin: 10px 0;
  }
  .swagger-ui .opblock.opblock-get {
    background: rgba(40, 167, 69, 0.05);
    border: 1px solid rgba(40, 167, 69, 0.2);
  }
  .swagger-ui .opblock.opblock-post {
    background: rgba(23, 162, 184, 0.05);
    border: 1px solid rgba(23, 162, 184, 0.2);
  }
  .swagger-ui .opblock.opblock-put {
    background: rgba(255, 193, 7, 0.05);
    border: 1px solid rgba(255, 193, 7, 0.2);
  }
  .swagger-ui .opblock.opblock-delete {
    background: rgba(220, 53, 69, 0.05);
    border: 1px solid rgba(220, 53, 69, 0.2);
  }
  .swagger-ui .opblock-tag {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #495057;
    font-weight: 600;
  }
  .swagger-ui .opblock-summary {
    font-weight: 500;
  }
  .swagger-ui .parameter__name {
    color: #28a745;
    font-weight: 500;
  }
  .swagger-ui .response-content-type {
    color: #17a2b8;
  }
  .swagger-ui .btn.authorize {
    background: #28a745;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-weight: 500;
  }
  .swagger-ui .btn.authorize:hover {
    background: #218838;
  }
  .swagger-ui .btn.execute {
    background: #007bff;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    font-weight: 500;
  }
  .swagger-ui .btn.execute:hover {
    background: #0056b3;
  }
  .swagger-ui .highlight-code {
    background: #f8f9fa;
  }
  .swagger-ui .model-box {
    background: #f8f9fa;
    border: 1px solid #dee2e6;
  }
  .swagger-ui .model .property {
    color: #495057;
  }
  .swagger-ui .model .property.primitive {
    color: #28a745;
  }
  .swagger-ui .response-col_description .markdown p {
    color: #6c757d;
  }
  body {
    background: #ffffff;
    color: #212529;
  }
  .swagger-ui {
    color: #212529;
  }
  .topbar {
    display: none;
  }

`;

const swaggerOptions = {
  customCss,
  customSiteTitle: "🚀 Hack The World API Docs",
  customfavIcon:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjMGEwYTBhIi8+Cjx0ZXh0IHg9IjE2IiB5PSIyMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzAwZmYwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SDwvdGV4dD4KPC9zdmc+",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
  },
};

module.exports = {
  specs,
  swaggerUi,
  swaggerOptions,
};
