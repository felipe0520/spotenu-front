import { Request, Response } from "express";
import { HashGenerator } from "../../services/HashGenerator";
import { UserDataBase } from "../../database/UserDataBase";
import { TokenGenerator } from "../../services/TokenGenerator";
import { LoginBusiness } from "../../business/login/LoginBusiness";
const functions = require("firebase-functions");

export class LoginController {
  private static loginBusiness = new LoginBusiness(
    new UserDataBase(),
    new HashGenerator(),
    new TokenGenerator()
  );
  public async login(req: Request, res: Response) {
    const user = {
      name: req.body.name,
      password: req.body.password,
    };
    try {
      const result = await LoginController.loginBusiness.login({
        nameOrNickname: user.name,
        password: user.password,
      });
      res.status(200).send(result);
      new UserDataBase().destroyConnection();
    } catch (error) {
      {
        res.status(400).send({ message: error.message });
        new UserDataBase().destroyConnection();
      }
    }
  }
}

// export type TypeUserLogin = {
//   nameOrNickname: string;
//   password: string;
// };
