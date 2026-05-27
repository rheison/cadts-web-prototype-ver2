# SecureDestroy / CADTS Web Prototype - Presentation Theme

This is a browser-based prototype for the Cloud Asset Destruction Tracking System (CADTS), also referred to as SecureDestroy.

## What it demonstrates

- Asset registration and inventory
- Destruction request submission
- Approval and rejection workflow
- Technician evidence recording
- Destruction closure
- Certificate generation and print view
- Compliance reporting
- CSV export
- Audit logging
- Role-based workflow guidance

## Important limitation

This is a static academic prototype. It stores demo records in the browser using localStorage. It does not include real authentication, real file upload storage, real cloud deletion, production access control, encryption, or immutable audit logging.

For a real production version, CADTS should use:

- Secure web front end
- Backend API
- Database
- Encrypted evidence storage
- Identity and access management
- Role-based access control
- Append-only audit logging
- Cloud integration controls

## Open locally

1. Unzip the folder.
2. Open `index.html` in a browser.
3. Use the sidebar role selector and workflow screens.

## Deploy free on GitHub Pages

1. Create a GitHub account or sign in.
2. Create a new public repository, for example `cadts-web-prototype`.
3. Upload `index.html`, `styles.css`, `app.js`, and this README file.
4. Go to the repository settings.
5. Open Pages.
6. Choose "Deploy from a branch."
7. Select the `main` branch and `/root`.
8. Save.
9. GitHub will publish a live web link after the deployment completes.

## Deploy free on Netlify

1. Sign in to Netlify.
2. Choose to add a new site.
3. Drag and drop this unzipped folder, or connect the GitHub repository.
4. Netlify will provide a live site URL.

## Deploy free on Vercel

1. Sign in to Vercel.
2. Create a new project.
3. Import the GitHub repository.
4. Since this is a static HTML/CSS/JavaScript prototype, no build command is required.
5. Deploy and use the provided Vercel URL.


## Presentation-style interface update

This version restyles the interface to look closer to the CADTS dashboard and request mockup shown in the project presentation slides. The updated UI uses a dark cybersecurity dashboard style, a glowing blue navigation system, status cards, recent request table, and a quick new-request panel.

To update GitHub Pages, replace the existing repository files with the files from this ZIP and commit the changes. GitHub Pages will automatically republish the site after the commit completes.


## User and role demonstration accounts

This version includes a login screen and a Users & Roles administration screen. Demo credentials:

- Administrator: admin@cadts.demo / admin123
- Asset Owner: asset@cadts.demo / demo123
- Approver: approver@cadts.demo / demo123
- IT Technician: tech@cadts.demo / demo123
- Auditor: auditor@cadts.demo / demo123

Students may also create a new account from the login screen. New accounts start as Pending Role Assignment. The administrator can sign in, open Users & Roles, assign the role, and activate the user.

Important: the GitHub Pages version stores user records in the browser using localStorage. This is enough for a classroom demonstration on one computer/projector. It is not a real shared authentication system. For students to register from different computers and appear immediately in the administrator queue, the project needs a backend such as Supabase Auth plus a hosted database.
