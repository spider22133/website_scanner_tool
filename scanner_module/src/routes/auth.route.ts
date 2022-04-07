import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import Route from '@/interfaces/route.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import axios from 'axios';

class AuthRoute implements Route {
  public path = '/';
  public router = Router();
  public authController = new AuthController();
  public CLIENT_ID = process.env.CLIENT_ID;
  public CLIENT_SECRET = process.env.CLIENT_SECRET;
  public FIRM_URL = process.env.FIRM_URL;
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.post(`${this.path}login`, validationMiddleware(CreateUserDto, 'body'), this.authController.logIn);
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);

    this.router.get(`${this.path}oauth/redirect`, (req, res) => {
      console.log(req.query.code);
      axios({
        method: 'POST',
        url: `${this.FIRM_URL}?client_id=${this.CLIENT_ID}&client_secret=${this.CLIENT_SECRET}&code=${req.query.code}`,
        headers: {
          Accept: 'application/json',
        },
      }).then(response => {
        console.log(response.data.access_token);
        res.redirect(`http://localhost:3000/dashboard?access_token=${response.data.access_token}`);
      });
    });
  }
}

export default AuthRoute;
