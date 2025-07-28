import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
];

moduleRoutes.forEach((moduleRoute) => {
  router.use(moduleRoute.path, moduleRoute.route);
});

// router.use("/user", UserRoutes);


