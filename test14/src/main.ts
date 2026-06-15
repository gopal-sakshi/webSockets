import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { getKafkaConfig } from './kafka-config';
import { WsAdapter } from "@nestjs/platform-ws";
import { KAFKA_CLIENT333 } from './kafka/kafka-provider';
import { CustomWsAdapter45 } from './websocket/custom-ws-adapter';

async function bootstrap() {

    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.enableShutdownHooks();

    const configService = app.get(ConfigService);

    const kafkaReference = app.connectMicroservice(getKafkaConfig(configService));
    const kafkaProvider = app.get(KAFKA_CLIENT333);
    await app.startAllMicroservices();

    const kafkaServer = kafkaReference.unwrap();
    const consumerReference = kafkaServer[1];
    kafkaProvider.setKafkaConsumer(consumerReference);
    app.useWebSocketAdapter(new CustomWsAdapter45(app));

    await app.listen(17865, '0.0.0.0');
    console.log('Application is running on: http://localhost:17865');
}
bootstrap();