import { Module } from '@nestjs/common';
import { PubSubModule } from './pubsub/pubsub.module';
import { WebsocketModule } from './websocket/web-socket.module';
import { ConnectionModule } from './connection-manager/connection.module';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from './kafka/kafka.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        PubSubModule.forRootAsync(),
        WebsocketModule,
        ConnectionModule,
        KafkaModule,
    ],
})
export class AppModule { }