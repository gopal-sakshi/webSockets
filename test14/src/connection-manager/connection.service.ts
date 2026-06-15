import { Injectable, OnModuleInit } from "@nestjs/common";
import { WEB_SOCKETS_PREFIX } from "src/common/constants";
import { PubSubService23 } from "src/pubsub/pubsub.service";
import { WebSocket } from 'ws';

interface Connection {
    ws: WebSocket,
    channelKeys: Set<string>
}

@Injectable()
export class ConnectionManagerService23 implements OnModuleInit { 

    private connections: Map<string, Connection> = new Map();
    private channelSubscribers: Map<string, Set<string>> = new Map();

    constructor(private pubSubService: PubSubService23) {}

    async onModuleInit() {
        await this.initializePubSub();
    }

    private async initializePubSub() {
        this.pubSubService.onMessage(this.handlePubSubMessage.bind(this));
    }

    private handlePubSubMessage(channel:string, message:string) {
        const channelKey = channel.slice(WEB_SOCKETS_PREFIX.length);
        this.routeMessage(channelKey, message);
    }

    private routeMessage(channelKey:string, message:any) {
        const subscribers23 = this.channelSubscribers.get(channelKey);
        if(!subscribers23) return;
        const payload = JSON.stringify({ event: channelKey, data:message });
        for (const clientId of subscribers23) {
            const connection = this.connections.get(clientId);
            if (connection && connection.ws.readyState === 1) {
                connection.ws.send(payload);
            }
        }
    }

    async connect(clientId: string, ws: WebSocket) {
        this.connections.set(clientId, {
            ws,
            channelKeys: new Set<string>()
        });
        console.log(`Tracked new connection233333333: ${clientId}`);
    }

    async disconnectByWebSocket(ws: WebSocket) {
        for (const [clientId, conn] of this.connections.entries()) {

            if (conn.ws !== ws) continue;

            for (const channelKey of conn.channelKeys) {
                this.channelSubscribers.get(channelKey)?.delete(clientId);
            }

            this.connections.delete(clientId);
            console.log(`Untracked connection dropped: ${clientId}`);
            break;
        }
    }

    async broadcastToChannelClients(channel: string, payload: any) {
        const outboundMessage = JSON.stringify({ event: channel, data: payload });
        
        this.connections.forEach((conn) => {
            if (conn.channelKeys.has(channel) && conn.ws.readyState === 1) { 
                conn.ws.send(outboundMessage);
            }
        });
    }

    async addSubscription(clientId: string, channelKey: string) {
        const conn = this.connections.get(clientId);
        if (!conn) {
            return;
        }
        conn.channelKeys.add(channelKey);
        if(!this.channelSubscribers.has(channelKey)) {
            this.channelSubscribers.set(channelKey, new Set());
            console.log("subscribing to channel ======= ", `${WEB_SOCKETS_PREFIX}${channelKey}`);
            await this.pubSubService.subscribe(`${WEB_SOCKETS_PREFIX}${channelKey}`);
        }
        this.channelSubscribers.get(channelKey)?.add(clientId);
        console.log(`Client ${clientId} subscirbed to channel: ${channelKey}`);
    }

    async removeSubscription(clientId:string, channelKey:string) {
        const conn = this.connections.get(clientId);
        if(!conn) return;
        conn.channelKeys.delete(channelKey);
        this.channelSubscribers.get(channelKey)?.delete(clientId);
        console.log(`Client ${clientId} unsubscribed from channel ${channelKey}`);
    }

}