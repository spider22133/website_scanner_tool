import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import Route from '@/interfaces/route.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import passport from 'passport';
const OAuth2Strategy = require('passport-oauth2');

class AuthRoute implements Route {
  public path = '/';
  public router = Router();
  public authController = new AuthController();
  public pass = passport;

  constructor() {
    this.initializeRoutes();
    this.pass.use(
      new OAuth2Strategy.Strategy(
        {
          authorizationURL: 'https://sso.3m5.de/adfs/oauth2/authorize',
          tokenURL: 'https://sso.3m5.de/adfs/oauth2/token',
          clientID: 'urn:3m5:website-scanner',
          callbackURL: 'http://websitescanner.3m5.de/oauth/redirect',
        },
        function (accessToken, refreshToken, profile, cb) {
          console.log('TOKEN', profile, accessToken);
        },
      ),
    );
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.get(`${this.path}login`, this.pass.authenticate('oauth2', { failureRedirect: '/login' }), this.authController.logIn);
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut);
  }
}

export default AuthRoute;
