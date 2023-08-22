import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  TESTING_URL,
  APP_PORT,
} from '../src/shared/constants';
import { ROUTES_API } from '../src/shared/apiRoutes';
import { ENDPOINTS } from '../src/shared/endpoints';
import { AuthDto } from '../src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(APP_PORT);
    prisma = app.get(PrismaService);
    prisma.cleanDb();
    pactum.request.setBaseUrl(
      `${TESTING_URL}:${APP_PORT}`,
    );
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'user1@gmail.com',
      password: '123',
    };
    describe('Signup', () => {
      it('Should throw if email is empty', () => {
        return pactum
          .spec()
          .post(
            `/${ROUTES_API.auth}/${ENDPOINTS.signup}`,
          )
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('Should throw if password is empty', () => {
        return pactum
          .spec()
          .post(
            `/${ROUTES_API.auth}/${ENDPOINTS.signup}`,
          )
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('Should throw if body is empty', () => {
        return pactum
          .spec()
          .post(
            `/${ROUTES_API.auth}/${ENDPOINTS.signup}`,
          )
          .expectStatus(400);
      });

      it('Should sign up', () => {
        return pactum
          .spec()
          .post(
            `/${ROUTES_API.auth}/${ENDPOINTS.signup}`,
          )
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('Should throw if email is empty', () => {
        return pactum
          .spec()
          .post(
            `/${ROUTES_API.auth}/${ENDPOINTS.signin}`,
          )
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('Should throw if password is empty', () => {
        return pactum
          .spec()
          .post(
            `/${ROUTES_API.auth}/${ENDPOINTS.signin}`,
          )
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('Should throw if body is empty', () => {
        return pactum
          .spec()
          .post(
            `/${ROUTES_API.auth}/${ENDPOINTS.signin}`,
          )
          .expectStatus(400);
      });

      it('Should sign in', () => {
        return pactum
          .spec()
          .post(
            `/${ROUTES_API.auth}/${ENDPOINTS.signin}`,
          )
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });
});
