import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { FacultyModule } from './modules/faculty/faculty.module';
import { NewsModule } from './modules/news/news.module';
import { EventsModule } from './modules/events/events.module';
import { NoticeModule } from './modules/notice/notice.module';
import { ResearchModule } from './modules/research/research.module';
import { AcademicsModule } from './modules/academics/academics.module';
import { AlumniModule } from './modules/alumni/alumni.module';
import { GalleryModule } from './modules/gallery/gallery.module';

@Module({
  imports: [
    // ── Environment config (loaded first, available everywhere) ───────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // ── MongoDB Atlas connection ───────────────────────────────────────────
    DatabaseModule,

    // ── Rate limiting ─────────────────────────────────────────────────────
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,   // 1-minute window
        limit: 100,    // max 100 requests per IP per window
      },
    ]),

    // ── Feature modules ───────────────────────────────────────────────────
    AuthModule,
    FacultyModule,
    NewsModule,
    EventsModule,
    NoticeModule,
    ResearchModule,
    AcademicsModule,
    AlumniModule,
    GalleryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
