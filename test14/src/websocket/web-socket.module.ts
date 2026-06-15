import { Module } from "@nestjs/common";
import { WebSocketGateway23 } from "./web-socket.gateway";

import { PubSubModule } from "../pubsub/pubsub.module";
import { ConnectionModule } from "src/connection-manager/connection.module";

@Module({
    imports: [ConnectionModule, PubSubModule], // Wire up the missing module links
    providers: [WebSocketGateway23],
    exports: [WebSocketGateway23]
})
export class WebsocketModule {}