import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';

@Controller()
export class KafkaController {
    constructor(private readonly kafkaService: KafkaService) { }

    @EventPattern('weSockets-user-updates23')
    async handleUserUpdate(@Payload() data: any) {
        console.log('Received event from Kafka:', data);
        await this.kafkaService.processMessage23(data);
    }
}