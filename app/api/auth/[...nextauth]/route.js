import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const users = [
    { id: "1", name: "Writer", username: "writer", password: "123", role: "writer" },
    { id: "2", name: "Publisher", username: "publisher", password: "123", role: "publisher" },
];

const options = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "username" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = users.find(user => user.username === credentials.username && user.password === credentials.password);
                if (user) {
                    return { id: user.id, name: user.name, username: user.username, role: user.role };
                } else {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role;
            return session;
        }
    },
    pages: {
        signIn: '/auth/login',
    },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };