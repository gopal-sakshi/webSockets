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
        console.log("topicKey ========== ", topicKey);
        const channel = `${WEB_SOCKETS_PREFIX}${topicKey}`;
        await Promise.all(
            // publish messages to channel ===========  "webSockets_repo23:user23user-123"
            // publish messages to channel ===========  "webSockets_repo23:user23user-456"
            [this.pubsubService.publish(channel, JSON.stringify(message))],
        )
    }


}