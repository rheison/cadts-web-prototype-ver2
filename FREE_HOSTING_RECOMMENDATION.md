# Free Hosting Recommendation for CADTS

## Best free option for the current course prototype

Use **GitHub Pages**.

Why:

- It hosts static HTML, CSS, and JavaScript.
- This prototype does not need a server to run.
- It is simple to submit as a live URL for school.
- It keeps your code files organized in a repository.

## Best free option for a later real app

Use **Vercel or Netlify** for the front end and **Supabase Free** for a database/backend prototype.

Why:

- Vercel and Netlify are better suited for modern web apps and deployments from GitHub.
- Supabase can provide a hosted PostgreSQL database, authentication, and storage.
- That would allow multiple users to log in and share the same CADTS data.

## Suggested milestone path

1. Submit this static browser prototype first.
2. Use it as the proof-of-concept for Milestone 1 and Milestone 2.
3. Later, upgrade to a real multi-user architecture:
   - React front end
   - Supabase database
   - Supabase authentication
   - Supabase storage for evidence files
   - API or serverless functions for certificate generation and workflow rules


## Uploading this updated visual theme

Upload and replace these root files in the GitHub repository:

- index.html
- styles.css
- app.js
- README.md
- FREE_HOSTING_RECOMMENDATION.md

After committing the replacement files, refresh the GitHub Pages URL. If the old version remains visible, hard refresh the browser.


## User accounts in this demo

The included user-login system is a front-end demonstration only. GitHub Pages hosts static files, so it does not provide a shared database by itself. User accounts, role assignments, requests, evidence metadata, and audit records are saved to the browser that is running the demo.

For a true multi-user live demonstration where each student registers from a separate device and the administrator sees the new user immediately, use a backend service. The recommended free prototype path is:

1. Keep GitHub Pages for the front end or move the front end to Vercel/Netlify.
2. Add Supabase Auth for real user registration and login.
3. Add Supabase tables for user profiles, roles, assets, requests, approvals, evidence metadata, certificates, and audit logs.
4. Add role-based row-level security rules.

For the current class demo, use one laptop/projector and switch accounts during the walkthrough.
