# itsmycv.be

# A Digital CV/Portfolio Identity Platform. Instant, secure, transferable for Belgian users.

# Built with Next.js and Supabase.

# Condidate Side : 
- One CV wallet to manage and share your CV/Portfolio.
- The condidate can create multiple variants of his CV/Portfolio.

- The condidate can share his CV/Portfolio with a unique link, or a QR code or send it by email.
- The condidate can track the views of his CV/Portfolio.

- Personal informations are stored securely in Supabase.

- Receive a Confirmation message to Allow or Deny access to your CV/Portfolio when someone tries to view it.

# Entity Side :
- Entities (Companies, Recruiters, HR, etc.) can create an account to :
  - Request access to view condidate's CV/Portfolio, with a specific message, Entity main info and reason for the request.
  - View condidate's CV/Portfolio (with condidate's permission).
  - Save condidate's CV/Portfolio for future reference, in their Entity's Library in their Dashboard. 
  - Manage all their requests and saved CV/Portfolios from their Dashboard.

  - analyze condidate's CV/Portfolio with AI tools (Resume Score, Skills Match, etc.) (Coming Soon).
  - Contact condidate directly from the platform. (Coming Soon).

# Admin Side :
- Manage Users (Condidates and Entities).
- Manage Content (FAQs, Terms of Service, Privacy Policy, etc.).
- View Platform Analytics (User Signups, CV/Portfolio Shares, etc.).
- Handle Support Requests.
- Monitor System Health and Performance.
- Manage Subscription Plans and Payments.
- Configure Platform Settings (Email Templates, Notification Settings, etc.).

# Technology Stack :
- Frontend: Next.js, React, Tailwind CSS.
- Backend: Supabase (PostgreSQL, Auth, Storage, Functions).
- PWA: Progressive Web App capabilities for offline access and installation.
- AI Integration: OpenAI API (for future features).
- Deployment: Vercel (for Next.js app), Supabase (for backend services).
- Environment Variables: Managed using .env.local file for local development and Vercel environment settings for production.
- Version Control: Git and GitHub for source code management.
- CI/CD: GitHub Actions for automated testing and deployment.
- Analytics: Google Analytics or similar for tracking user interactions and platform performance.
- Monitoring: Sentry or similar for error tracking and performance monitoring.

# Security Considerations :
- Ensure all sensitive data is stored securely using Supabase's built-in security features.
- Implement HTTPS to encrypt data in transit.
- Use strong authentication and authorization mechanisms.
- Regularly update dependencies to patch security vulnerabilities.
- Conduct security audits and penetration testing periodically.
- Comply with data protection regulations (e.g., GDPR) regarding user data handling and privacy.

# Current features :
- Multi-Language Support: Add support for multiple languages to cater to a broader audience.

# Future Enhancements :
- Mobile App: Develop a mobile application for iOS and Android for easier access to CV/Portfolio management.
- AI-Powered Features: Integrate AI tools for resume optimization, skill matching, and interview preparation.
- Social Media Integration: Allow users to link their CV/Portfolio to social media profiles like LinkedIn.
- Collaboration Features: Enable condidates to collaborate with mentors or career coaches on their CV/Portfolio.
- Advanced Analytics: Provide condidates with insights on how their CV/Portfolio is performing (e.g., views, shares, feedback).

# Deployment Instructions :
1. Clone the repository to your local machine.
2. Install dependencies using `npm install` or `yarn install`.
3. Set up a Supabase project and configure the necessary tables and authentication settings.
4. Create a `.env.local` file in the root directory and add your environment variables (e.g., Supabase URL, Supabase Key, OpenAI API Key).
5. Run the development server using `npm run dev` or `yarn dev`.
6. Open your browser and navigate to `http://localhost:3000` to view the application.
7. For production deployment, configure your hosting platform (e.g., Vercel) with the same environment variables and deploy the application.

# Note : Ensure to keep your environment variables secure and do not expose sensitive information in the codebase.
