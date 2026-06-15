import { InjectRedis } from "@nestjs-modules/ioredis";
import Redis from "ioredis";
import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class PubSubService23 implements OnModuleInit { 

    private subscriber: Redis;
    private publisher: Redis;

    constructor(@InjectRedis() redis: Redis) { 
        this.publisher = redis.duplicate();
        this.subscriber = redis.duplicate();
    }

    async onModuleInit() { // Fixed casing 'OnModuleInit' -> 'onModuleInit'
        this.subscriber.on('connect', () => {
            console.log('Redis Subscriber Connected');
        });
        this.publisher.on('connect', () => {
            console.log('Redis Publisher Connected');
        });
    }

    // Handles inbound message routing across all active subscriptions
    onMessage(callback: (receivedChannel: string, message: any) => void) {
        this.subscriber.on('message', (channel, message) => {
            try {
                const parsed = JSON.parse(message);
                callback(channel, parsed);
            } catch {
                callback(channel, message);
            }
        });
    }

    async subscribe(channel: string) {
        await this.subscriber.subscribe(channel);
        console.log(`Subscribed to Redis channel: ${channel}`);
    }

    async publish(channel: string, message: string) {
        await this.publisher.publish(channel, message);
    }
}