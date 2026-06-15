import { Transport } from "@nestjs/microservices"
import { ConfigService } from "@nestjs/config";

export const getKafkaConfig = (configService: ConfigService) => {
    return {
        transport: Transport.KAFKA,
        options: {
            client: configService.get('KAFKA_CLIENT_ID23'),
            brokers: configService.get('KAFKA_BROKERS23'),
            retry: { initialRetryTime: 100, retries: 8 }, 
            consumer: { 
                groupId: 'websockets_repo-consumer-group', 
                allowAutoTopicCreation: true
            }
        },
    }
}