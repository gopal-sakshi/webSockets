import { PubSubService23 } from "src/pubsub/pubsub.service";
import { Inject, Injectable } from "@nestjs/common";
import { KAFKA_CLIENT333 } from "./kafka-provider";
import { Consumer } from "kafkajs";
import { WEB_SOCKETS_PREFIX } from "src/common/constants";

@Injectable()
export class KafkaService {

    constructor(
        private readonly pubsubService: PubSubService23,
        @Inject(KAFKA_CLIENT333) private readonly kafkaClientProvider,
    ) { }

    get kafkaConsumer():Consumer {
        return this.kafkaClientProvider.getKafkaConsumer()
    }

    async processMessage23(message:any) {
        const topicKey = message.routingKey || 'broadcast';
        const channel = `${WEB_SOCKETS_PREFIX}${topicKey}`;
        await Promise.all(
            [this.pubsubService.publish(channel, JSON.stringify(message))]
        )
    }


}