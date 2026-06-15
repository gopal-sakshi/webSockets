import { DynamicModule, Module } from "@nestjs/common";
import { RedisModule } from '@nestjs-modules/ioredis';
import { PubSubService23 } from "./pubsub.service";

@Module({
    providers: [PubSubService23],
    exports: [PubSubService23]
})
export class PubSubModule {
    static forRootAsync(): DynamicModule {
        return {
            module: PubSubModule,
            imports: [
                // Fixed your array syntax here to a standard NestJS async config
                RedisModule.forRootAsync({
                    useFactory: () => ({
                        type: 'single',
                        url: 'redis://localhost:6379',
                    }),
                })
            ],
            exports: [PubSubService23]
        };
    }
}