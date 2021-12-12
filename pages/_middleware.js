import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

//CRAZY MAGIC STUFF
export async function middleware(req) {
  //TOKEN WILL EXIST WHEN USER IS LOGGED IN
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  if (token && pathname.includes("/login")) {
    //there could be more unprotected roots
    return NextResponse.redirect("/");
  }

  //ALLOW THE REQ
  //if user does auth or token exists
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  //REDIRECT IF NO TOKEN AND THE PATH IS NOT AUTH
  if (!token && pathname !== "/login") {
    //there could be more unprotected roots
    return NextResponse.redirect("/login");
  }
}
