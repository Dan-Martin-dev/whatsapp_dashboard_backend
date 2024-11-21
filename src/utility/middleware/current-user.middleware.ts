import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator'; // This import is fine if you're using class-validator
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import { verify } from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
dotenv.config();
// Middleware: Functions that are executed during an http request (when the client makes a request and the server handles it)

// Este middleware es útil cuando necesitas verificar y extraer un token de autorización de las cabeceras HTTP
// antes de que la solicitud continúe su curso.

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: UserEntity;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    // Verifica si la solicitud HTTP (el objeto req) contiene un encabezado de autorización (authorization) con un token JWT.
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      isArray(authHeader) ||
      !authHeader.startsWith('Bearer ')
    ) {
      req.currentUser = null;
      next();
      return;
    } else {
      try {
        //Si el encabezado es válido, se extrae el token y se utiliza la función verify de jsonwebtoken para decodificarlo utilizando una clave secreta (process.env.ACCESS_TOKEN_SECRET_KEY).
        //Con el id obtenido del token, el middleware consulta la base de datos utilizando el servicio UsersService para obtener los detalles del usuario (a través del método findOne(id)).
        //Si encuentra al usuario, lo asigna a la propiedad req.currentUser, lo que permite que cualquier controlador o servicio que procese la solicitud tenga acceso al usuario autenticado.
        const token = authHeader.split(' ')[1];
        const { id } = <JwtPayload>(
          verify(token, process.env.ACCESS_TOKEN_SECRET_KEY)
        );
        const currentUser = await this.usersService.findOne(+id);
        req.currentUser = currentUser;
        console.log(currentUser);
        next();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        req.currentUser = null;
        next();
      }
    }
  }
}
interface JwtPayload {
  id: string;
}
