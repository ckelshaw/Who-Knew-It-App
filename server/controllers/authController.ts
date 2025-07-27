import { Request, Response } from "express";

export const login = (req: Request, res: Response) => {
  const { username } = req.body;

  if (username.toLowerCase() === "matt") {
    return res.status(200).json({ role: "house" });
  }

  return res.status(401).json({ role: "denied" });
};