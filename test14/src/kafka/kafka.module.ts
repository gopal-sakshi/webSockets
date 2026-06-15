import { PubSubModule } from "src/pubsub/pubsub.module";
import { KafkaController } from "./kafka-controller";
import { KafkaService } from "./kafka.service";
import { Module } from "@nestjs/common";
import { KafkaClientProvider } from "./kafka-provider";

@Module({
    imports:[PubSubModule],
    controllers: [KafkaController],
    exports: [KafkaClientProvider, KafkaService],
    providers: [KafkaClientProvider, KafkaService]
})
export class KafkaModule { }