# CS-465 Full Stack Development with MEAN

## Architecture
- **Compare and contrast the types of frontend development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA).**
  
  In this project, the customer-facing frontend uses Express with Handlebars for server-side rendering (SSR), meaning the server builds a completely new HTML page from scratch and sends it to the browser on every single click. In contrast, the administrative workspace is built as an Angular Single-Page Application (SPA), which uses client-side rendering (CSR). The Angular SPA downloads a single layout shell and a JavaScript bundle just once, using its own router to surgically swap out specific DOM fragments in real time without ever forcing a slow browser refresh.
  
- **Why did the backend use a NoSQL MongoDB database?**
  
  The backend utilizes MongoDB because its document-based, schema-flexible structure perfectly matches the object-oriented nature of JavaScript and the dynamic requirements of a travel application. Unlike rigid SQL databases that require complex relational joins across multiple tables, MongoDB allows us to store an entire trip package—including names, resorts, pricing, images, and HTML descriptions—as a single, self-contained document that map directly to our frontend data models.

## Functionality
- **How is JSON different from Javascript and how does JSON tie together the frontend and backend development pieces?**
  
  JavaScript is a full programming language used to build logic, execute functions, and manipulate applications, whereas JSON (JavaScript Object Notation) is strictly a lightweight, text-based data format used to store and exchange information. JSON acts as the universal language across the entire MEAN stack bridge; it allows the MongoDB database, the Express API, and the Angular SPA to seamlessly pass raw data payloads back and forth regardless of how different their individual internal architectures are.
- **Provide instances in the full stack process when you refactored code to improve functionality and efficiencies, and name the benefits that come from reusable user interface (UI) components.**
  
  A major full-stack refactor occurred when moving from legacy, class-based middleware to Angular’s modern Functional Interceptors (HttpInterceptorFn). By using inject(Authentication) right inside the stream instead of a heavy constructor class, we vastly simplified token management, improved execution speed, and made it easy to securely clone and append JWT headers to outgoing HTTP requests. Additionally, building reusable UI components like the app-trip-card provided massive benefits: it eliminated code duplication by allowing a single component template to render endless trips using data binding, and ensured that when we added authentication rules to hide the "Edit Trip" button, the security logic applied globally and instantly across the app.

## Testing
- **Methods for request and retrieval necessitate various types of API testing of endpoints, in addition to the difficulties of testing with added layers of security. Explain your understanding of methods, endpoints, and security in a full stack application.**
  
  Full-stack development relies on specific HTTP methods mapped to API endpoints (like GET /api/trips to retrieve data or PUT /api/trips/:code to update it). Testing this pipeline requires a two-step process: first, isolating the Express endpoints using tools like Postman to verify database mutations and raw JSON responses, and second, testing frontend integration using browser Developer Tools to watch live network traffic. Adding security layers like Passport authentication and JWTs introduces testing challenges, as requests will immediately fail with 401 Unauthorized errors unless the authentication order-of-operations is perfect. We solved this by ensuring dotenv.config() loaded environment variables at the absolute top of app.js and using a functional interceptor to automatically attach the required Bearer tokens to secure outgoing headers.

## Reflection
- **How has this course helped you in reaching your professional goals? What skills have you learned, developed, or mastered in this course to help you become a more marketable candidate in your career field?**
  
  This course was a massive milestone in my professional goals, transforming my understanding of how disconnected frontend and backend systems communicate in production environments. Through hands-on troubleshooting, I mastered state management using modern Angular Signals, implemented clean control flow architecture using the new template @if and @for notations, and gained deep practical experience securing API pipelines with Passport and JSON Web Tokens (JWT). Having the ability to architect, debug, and connect an independent Node/Express REST API to a secure, decoupled SPA makes me a highly versatile and marketable full-stack engineer ready for modern enterprise development.
