import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConnectModule } from '@app/database-connect';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { features } from './modules';
import { appConfigurations } from 'src/environments/environments';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.env.NODE_ENV}.env`],
      load: [appConfigurations],
      isGlobal: true,
    }),
    DatabaseConnectModule,
    ...features,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get<number>('app.port') || 3333;
  }
}
