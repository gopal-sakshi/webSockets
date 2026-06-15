import { Module } from "@nestjs/common";
import { ConnectionManagerService23 } from "./connection.service";
import { PubSubModule } from "../pubsub/pubsub.module";

@Module({
    imports: [PubSubModule],
    providers: [ConnectionManagerService23],
    exports: [ConnectionManagerService23]
})
export class ConnectionModule {}