import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws'; 
import { PubSubService23 } from '../pubsub/pubsub.service';
import { ConnectionManagerService23 } from '../connection-manager/connection.service';

@WebSocketGateway({ path: '/ws' }) 
export class WebSocketGateway23 implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer()
    server: Server;

    private readonly cliendIds = new WeakMap<WebSocket, string>();

    constructor(
        private readonly pubSubService: PubSubService23,
        private readonly connectionManager: ConnectionManagerService23
    ) { }

    afterInit() {
        console.log('Native WS Gateway Initialized.');
    }

    handleConnection(client: WebSocket, req: any) {
        const clientId = Math.random().toString(36).substring(7); 
        this.cliendIds.set(client, clientId);
        this.connectionManager.connect(clientId, client);
        client.on('message', (raw) => {
            try {
                const data = JSON.parse(raw.toString());
                if(data.action === 'subscribe' && data.channel) {
                    this.connectionManager.addSubscription(clientId, data.channel);
                } else if(data.action === 'unsubscribe' && data.channel) {
                    this.connectionManager.removeSubscription(clientId, data.channel);
                }
            } catch(err) {
                console.log("err34343 ===== ", err);
                client.send(JSON.stringify({error:`Invalid message format`}));
            }
        });
        
        this.connectionManager.addSubscription(clientId, 'websocket-broadcast');
    }

    handleDisconnect(client: WebSocket) {
        this.connectionManager.disconnectByWebSocket(client);
        this.cliendIds.delete(client);
    }
}