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

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
          },
        }),
      }),
    }),

    CustomerModule,
    DoctorModule,

  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
