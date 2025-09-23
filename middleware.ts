import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Let the client-side AuthGuard handle redirections
    return
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isLoginPage = req.nextUrl.pathname === "/admin/login"

        // Always allow login page
        if (isLoginPage) {
          return true
        }

        // For admin routes, require authentication
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token
        }

        // Allow all other routes
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*"]
}