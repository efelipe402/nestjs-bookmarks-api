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
import { EditUserDto } from '../src/user/dto';
import {
  CreateBookmarkDto,
  EditBookmarkDto,
} from '../src/bookmarks/dto';

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

  // USER AUTH TESTING
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

  // USER TESTING
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get(
            `/${ROUTES_API.users}/${ENDPOINTS.me}`,
          )
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Juan Lopez',
          email: 'user1@gmail.com',
        };
        return pactum
          .spec()
          .patch(`/${ROUTES_API.users}`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });

    describe('Bookmarks', () => {
      describe('Get empty bookmarks', () => {
        it('should get bookmarks', () => {
          return pactum
            .spec()
            .get(`/${ROUTES_API.bookmarks}`)
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectBody([]);
        });
      });

      describe('Create bookmark', () => {
        const dto: CreateBookmarkDto = {
          title: 'First Bookmark',
          link: 'https://www.youtube.com/watch?v=d6WC5n9G_sM',
        };
        it('should create bookmark', () => {
          return pactum
            .spec()
            .post(`/${ROUTES_API.bookmarks}`)
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withBody(dto)
            .expectStatus(201)
            .stores('bookmarkId', 'id');
        });
      });

      describe('Get bookmarks', () => {
        it('should get bookmarks', () => {
          return pactum
            .spec()
            .get(`/${ROUTES_API.bookmarks}`)
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectJsonLength(1);
        });
      });

      describe('Get bookmark by id', () => {
        it('should get bookmark by id', () => {
          return pactum
            .spec()
            .get(
              `/${ROUTES_API.bookmarks}/{${ENDPOINTS.id}}`,
            )
            .withPathParams(
              'id',
              '$S{bookmarkId}',
            )
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectBodyContains('$S{bookmarkId}')
            .inspect();
        });
      });

      describe('Edit bookmark by id', () => {
        const dto: EditBookmarkDto = {
          title:
            'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
          description:
            'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
        };
        it('should edit bookmark', () => {
          return pactum
            .spec()
            .patch(
              `/${ROUTES_API.bookmarks}/{${ENDPOINTS.id}}`,
            )
            .withPathParams(
              'id',
              '$S{bookmarkId}',
            )
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withBody(dto)
            .expectStatus(200)
            .expectBodyContains(dto.title)
            .expectBodyContains(dto.description);
        });
      });

      describe('Delete bookmark by id', () => {
        it('should delete bookmark', () => {
          return pactum
            .spec()
            .delete(
              `/${ROUTES_API.bookmarks}/{${ENDPOINTS.id}}`,
            )
            .withPathParams(
              'id',
              '$S{bookmarkId}',
            )
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(204);
        });

        it('should get empty bookmarks', () => {
          return pactum
            .spec()
            .get(`/${ROUTES_API.bookmarks}`)
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectJsonLength(0);
        });
      });
    });
  });
});
