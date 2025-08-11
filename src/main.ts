import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuard } from './common/auth/auth.guard';
import { BrowserInterceptor } from './common/browser/browser.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // apply guard globaly
  app.useGlobalGuards(new AuthGuard());
  // apply interceptor globally
  app.useGlobalInterceptors(new BrowserInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
