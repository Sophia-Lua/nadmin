import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from './common/cache/cache.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { SysUserModule } from './modules/system/sys-user/sys-user.module';
import { RoleModule } from './modules/system/role/role.module';
import { MenuModule } from './modules/system/menu/menu.module';
import { DeptModule } from './modules/system/dept/dept.module';
import { PostModule } from './modules/system/post/post.module';
import { DictModule } from './modules/system/dict/dict.module';
import { SysConfigModule } from './modules/system/config/config.module';
import { NoticeModule } from './modules/system/notice/notice.module';
import { OperlogModule } from './modules/monitor/operlog/operlog.module';
import { LogininforModule } from './modules/monitor/logininfor/logininfor.module';
import { OnlineModule } from './modules/monitor/online/online.module';
import { ServerModule } from './modules/monitor/server/server.module';
import { MonitorCacheModule } from './modules/monitor/monitor-cache/monitor-cache.module';
import { JobModule } from './modules/monitor/job/job.module';
import { JobLogModule } from './modules/monitor/job-log/job-log.module';
import { DataModule } from './modules/monitor/data/data.module';
import { ProfileModule } from './modules/system/profile/profile.module';
import { BuildModule } from './modules/tool/build/build.module';
import { CommonModule } from './modules/common/common.module';
import { HomeModule } from './modules/system/home/home.module';
import { GenModule } from './modules/tool/gen/gen.module';
import { SwaggerModule } from './modules/tool/swagger/swagger.module';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    CacheModule,
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    ProfileModule,
    SysUserModule,
    RoleModule,
    MenuModule,
    DeptModule,
    PostModule,
    DictModule,
    SysConfigModule,
    NoticeModule,
    OperlogModule,
    LogininforModule,
    OnlineModule,
    ServerModule,
    MonitorCacheModule,
    CacheModule,
    JobModule,
    JobLogModule,
    DataModule,
    HomeModule,
    BuildModule,
    GenModule,
    SwaggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
