import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AppService } from '../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  let server: ReturnType<typeof app.getHttpServer>;
  let appService: AppService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appService = app.get<AppService>(AppService);
    server = app.getHttpServer();
    await app.init();
  });

  describe('/ GET', () => {
    // when invalid api key, return 403
    it(`should return a 403 when an invalid api key is used`, () => {
      return request(server).get('/').set('x-api-key', 'INVALID').expect(403);
    });

    // when no api key, return 403
    it(`should return a 403 when no api key is used`, () => {
      return request(server).get('/').expect(403);
    });

    // /GET should return a eandom emoji
    it(`should return a random emoji`, () => {
      const emojis = appService.getEmojis();
      return request(server)
        .get('/')
        .set('x-api-key', 'SECRET')
        .expect(({ body }) => {
          expect(emojis).toContain(body.data.emoji);
          expect(body.data.browser).toBe(`Unknown`);
        });
    });

    it(`should return respective user agent`, () => {
      const emojis = appService.getEmojis();
      return request(server)
        .get('/')
        .set('x-api-key', 'SECRET')
        .set('User-Agent', 'PostmanRuntime/7.45.0')
        .expect(({ body }) => {
          expect(emojis).toContain(body.data.emoji);
          expect(body.data.browser).toBe(`PostmanRuntime/7.45.0`);
        });
    });

    // /?index=0 should return the emoji at index 0
    it(`valid index query should return respective emoji`, () => {
      const emojis = appService.getEmojis();
      const index = 0;
      const indexedEmoji = emojis[index];
      return request(server)
        .get(`/?index=${index}`)
        .set('x-api-key', 'SECRET')
        .expect(({ body }) => {
          expect(body.data.emoji).toBe(indexedEmoji);
        });
    });

    // /?index=100 should return 400
    it(`should return 400 when out of range index is used`, () => {
      const emojis = appService.getEmojis();
      const emojisLength = emojis.length;
      const range = emojisLength + 1;
      return request(server)
        .get(`/?index=${range}`)
        .set('x-api-key', 'SECRET')
        .expect(400);
    });

    // /?index=not-a-number should return 400
    it(`should return 400 when non-number index is used`, () => {
      return request(server)
        .get(`/?index=not-a-number`)
        .set('x-api-key', 'SECRET')
        .expect(400);
    });
  });
});
