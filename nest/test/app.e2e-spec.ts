import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Susi Air Pilot App REST API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/login - should fail with 401 on bad credentials', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'johndoe', password: 'badpassword' });

    expect(res.status).toBe(401);
    expect(res.body.statusCode).toBe(401);
  });

  it('POST /auth/login - should authenticate johndoe and return token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'johndoe', password: 'susiairtest' });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    authToken = res.body.accessToken;
  });

  it('GET /pilot/me - should fail without token with 401', async () => {
    await request(app.getHttpServer()).get('/pilot/me').expect(401);
  });

  it('GET /pilot/me - should return pilot profile with token', async () => {
    const res = await request(app.getHttpServer())
      .get('/pilot/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.name).toBe('John Doe');
  });

  it('GET /flight-hours - should reject invalid date range with 400', async () => {
    await request(app.getHttpServer())
      .get('/flight-hours?from=2026-05-20&to=2026-05-10')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400);
  });

  it('GET /flight-hours/summary - should return rolling sum and 15-day series', async () => {
    const res = await request(app.getHttpServer())
      .get('/flight-hours/summary?range=1w')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.series.length).toBe(15);
    expect(res.body.series[7].isToday).toBe(true);
  });

  it('GET /documents - should return evaluated documents in urgency order', async () => {
    const res = await request(app.getHttpServer())
      .get('/documents')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.documents.length).toBe(5);
    expect(res.body.documents[0].status).toBe('expired');
  });

  it('GET /schedules - should reject invalid month with 400', async () => {
    await request(app.getHttpServer())
      .get('/schedules?year=2026&month=13')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400);
  });

  it('GET /schedules?year=2026&month=05 - should return May schedules', async () => {
    const res = await request(app.getHttpServer())
      .get('/schedules?year=2026&month=05')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.entries.length).toBeGreaterThan(10);
  });
});
