import { Consumer } from "kafkajs";
import { Provider } from "@nestjs/common";

export const KAFKA_CLIENT333 = 'KAFKA_CLIENT333';

export const KafkaClientProvider:Provider = {
    provide: KAFKA_CLIENT333,
    useFactory: async () => {
        let kafkaCosumer:Consumer;
        const setKafkaConsumer = (client:Consumer) => {
            kafkaCosumer = client;
        };
        return {
            setKafkaConsumer,
            getKafkaConsumer: () => kafkaCosumer
        }
    }
}