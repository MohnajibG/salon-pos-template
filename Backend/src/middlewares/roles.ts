// import { NextFunction, Response } from "express";
// import { AuthRequest } from "../types/auth";
// import { Role } from "../types/auth";

// export const authorize =
//   (...roles: Role[]) =>
//   (req: AuthRequest, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       return res.status(401).json({
//         message: "Unauthorized",
//       });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         message: "Access denied",
//       });
//     }

//     next();
//   };
