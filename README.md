This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Setup

Before running the project, set up the environment variables. Start by copying the `.env.example` file and renaming it to `.env.local`. Then, generate an encryption key by running the following command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated key and paste it into the .env.local file.

### Authentication Credentials
The application uses NextAuth.js for authentication, providing two user roles: Writer and Publisher. To access the respective sessions, use the following credentials:

#### Writer Session

Username: `writer`
Password: `123`

#### Publisher Session

Username: `publisher`
Password: `123`

Please note that these credentials are for demonstration purposes only. In a production environment, it is crucial to implement a secure authentication protocol, such as JWT (JSON Web Token), to protect user passwords and ensure secure communication. This involves hashing passwords on the server side and following best practices for user authentication and authorization.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
