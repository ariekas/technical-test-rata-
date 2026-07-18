import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';


import { AppResolver } from './app.resolver';
import { CustomerModule } from './customer/customer.module';
import { DoctorModule } from './doctor/doctor.module';
import { ScheduleModule } from './schedule/schedule.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }: any) => ({ req, res }),
    }),

    RedisModule,

    CustomerModule,
    DoctorModule,
    ScheduleModule,

  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
