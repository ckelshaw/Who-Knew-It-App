import { Request, Response } from "express";

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;
  const HOUSE_PASSWORD = process.env.HOUSE_PASSWORD;

  if (username.toLowerCase() === "matt" && password === HOUSE_PASSWORD) {
    return res.status(200).json({ role: "house" });
  }

  return res.status(401).json({ role: "Unauthorized" });
};