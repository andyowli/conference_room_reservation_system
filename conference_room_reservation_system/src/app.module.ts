import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [ 
    UserModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "123456",
      database: "conference_room_reservation_system",
      synchronize: true,
      logging: true,
      entities: [
        User,Role,Permission
      ],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
    RedisModule,
    EmailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
