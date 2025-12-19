// import { Request, Response } from "express";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "dev_only_change_me";
// const HOUSE_PASSWORD = process.env.HOUSE_PASSWORD;

// // 7d signed session cookie
// function setSessionCookie(res: Response, payload: { sub: string; role: "house" }) {
//   const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
//   res.cookie("auth", token, {
//     httpOnly: true,
//     sameSite: "lax",
//     secure: false,           // set true in prod behind HTTPS
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   });
// }

// export const login = (req: Request, res: Response) => {
//   const { username, password } = req.body as { username: string; password: string };

//   if (username?.toLowerCase() === "matt" && password === HOUSE_PASSWORD) {
//     //TODO: you can use a DB id here; using a constant is fine for now
//     const hostId = "house-1";
//     setSessionCookie(res, { sub: hostId, role: "house" });
//     return res.status(200).json({ ok: true, userId: hostId, role: "house" });
//   }

//   return res.status(401).json({ ok: false, error: "Unauthorized" });
// };

// export const logout = (_req: Request, res: Response) => {
//   res.clearCookie("auth");
//   res.json({ ok: true });
// };

// export const me = (req: Request, res: Response) => {
//   const token = req.cookies?.auth;
//   if (!token) return res.json({ userId: null, role: null });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as any;
//     return res.json({ userId: decoded.sub as string, role: decoded.role as "house" });
//   } catch {
//     return res.json({ userId: null, role: null });
//   }
// };