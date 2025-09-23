import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Hardcoded admin credentials
        const adminEmail = "info@sdkthunder.com";
        const adminPassword = "SDKThunder2025!Admin#Secure";

        if (credentials?.email === adminEmail && credentials?.password === adminPassword) {
          return {
            id: "1",
            email: adminEmail,
            name: "SDK Thunder Admin",
            role: "admin"
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub ?? ''
        session.user.role = token.role
      }
      return session
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }