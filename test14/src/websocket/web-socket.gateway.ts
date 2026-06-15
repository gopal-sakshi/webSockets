import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws'; // Shifted from socket.io to raw 'ws'
import { PubSubService23 } from '../pubsub/pubsub.service';
import { ConnectionManagerService23 } from '../connection-manager/connection.service';


@WebSocketGateway({ path: '/ws' }) 
export class WebSocketGateway23 implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly pubSubService: PubSubService23,
        private readonly connectionManager: ConnectionManagerService23
    ) { }

    afterInit() {
        console.log('Native WS Gateway Initialized.');

        // Initialize listening for all Redis pub/sub messages globally
        this.pubSubService.onMessage((channel, message) => {
            
            // OPTION A: Broadcast to ALL connected WS instances globally
            const payload = JSON.stringify({ event: channel, data: message });
            this.server.clients.forEach((client) => {
                if (client.readyState === 1) {
                    client.send(payload);
                }
            });

            // OPTION B: Or map selectively using your connection manager:
            // this.connectionManager.broadcastToChannelClients(channel, message);
        });

        // Auto-subscribe down to your target channels
        this.pubSubService.subscribe('websocket-broadcast');
    }

    handleConnection(client: WebSocket, req: any) {
        // Generate temporary ID or pull from auth query strings
        const clientId = Math.random().toString(36).substring(7); 
        
        this.connectionManager.connect(clientId, client);
        
        // Example: Auto-add them to a channel track list on connect
        this.connectionManager.addSubscription(clientId, 'websocket-broadcast');
    }

    handleDisconnect(client: WebSocket) {
        this.connectionManager.disconnectByWebSocket(client);
    }
}