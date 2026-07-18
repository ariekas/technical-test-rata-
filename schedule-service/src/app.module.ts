import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';


import { AppResolver } from './app.resolver';
import { CustomerModule } from './customer/customer.module';
import { DoctorModule } from './doctor/doctor.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }: any) => ({ req, res }),
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        if (!process.env.REDIS_HOST) {
          return {};
        }

        return {
          store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
          },
          }),
        };
      },
    }),

    CustomerModule,
    DoctorModule,
    ScheduleModule,

  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
