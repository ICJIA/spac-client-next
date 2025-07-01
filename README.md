[![Netlify Status](https://api.netlify.com/api/v1/badges/71c65928-9986-4104-bd78-465726edb356/deploy-status)](https://app.netlify.com/sites/spac/deploys)

# Illinois Sentencing Policy Advisory Council

> The concept for Illinois' sentencing commission, the Sentencing Policy Advisory Council (SPAC), was developed by the Criminal Law Edit, Alignment and Reform (CLEAR) Commission in 2009. The CLEAR Commissioners studied and reorganized the Unified Code of Corrections in an effort to make it less confusing and easier for the public and practitioners to use. That process led to the conclusion that, although many agencies collected statistics and data about sentencing in Illinois, no agency compiled sentencing data specifically to perform comprehensive analysis for reporting to policy makers.

> SPAC was created to collect, analyze and present data from all relevant sources to more accurately determine the consequences of sentencing policy decisions and to review the effectiveness and efficiency of current sentencing policies and practices. SPAC reports directly to the Governor and the General Assembly.

## Documentation

This project includes comprehensive documentation accessible through a centralized portal:

### 📚 Documentation Portal
Access the main documentation portal at: **`/documentation/`**

The portal provides easy navigation to all available documentation:

#### 🔧 Developer Documentation (`/documentation/dev/`)
- **Complete project setup and installation guide**
- **Architecture overview and technical specifications**
- **Development workflows and best practices**
- **Deployment instructions and environment configuration**
- **Component library and usage examples**

#### 📖 JSDoc API Documentation (`/documentation/jsdoc/`)
- **Auto-generated API documentation from code comments**
- **Function signatures, parameters, and return values**
- **Service and utility module documentation**
- **Interactive search functionality**
- **Light/dark theme support**

### 🛠️ Documentation Commands

```bash
# Generate all documentation (dev + API docs)
npm run docs:generate

# Generate only developer documentation
npm run docs:dev

# Generate only JSDoc API documentation
npm run docs:jsdoc
```

**Note:** Documentation is automatically generated during the build process (`npm run build`) and development server startup (`npm run serve`).

## Setup
```
npm install
```

## Installation

Rename ```env.sample``` to ```.env``` and fill in missing variables.

## Compile and hot-reload for development
```
npm run serve
```

## Build for production
```
npm run build
```

Deploy ```/dist``` folder.

**Note:** The build process automatically includes all documentation in the `/dist/documentation/` directory.

