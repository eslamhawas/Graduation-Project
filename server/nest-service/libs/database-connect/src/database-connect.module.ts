import { Module } from '@nestjs/common';
import { DatabaseConnectService } from './database-connect.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConnectOptions } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get<string>('database.type'),
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.name'),
          // synchronize: configService.get<boolean>('database.synchronize'),
          synchronize: false,
          autoLoadEntities: configService.get<boolean>('database.autoLoadEntities'),
          entities: configService.get<any[]>('database.entities'),
          // seeds: configService.get<any[]>('database.seeds')
        } as ConnectOptions;
      },
    }),
  ],
  providers: [DatabaseConnectService],
  exports: [DatabaseConnectService],
})
export class DatabaseConnectModule {}
