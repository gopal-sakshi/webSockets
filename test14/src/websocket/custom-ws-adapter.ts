import { WsAdapter } from '@nestjs/platform-ws';
import { INestApplicationContext } from '@nestjs/common';
import * as url from 'url';
import * as http from 'http';

export class CustomWsAdapter45 extends WsAdapter {

    constructor(private readonly app: INestApplicationContext) {
        super(app);
    }

    public override create(port: number, options?: any) {

        const server = super.create(port, options);
        const originalHandleUpgrade = server.handleUpgrade.bind(server);

        server.handleUpgrade = async (request:http.IncomingMessage, socket, head, callback) => {
            try {
                const host = request.headers.host;
                const url = new URL(request.url, `ws://${host}`);
                const token = url.searchParams.get('Token');
                if (!token) {
                    throw new Error('Missing token');
                }
                try {
                    console.log("token rcvd 432432 ===> ", token);
                    originalHandleUpgrade(request, socket, head, callback);
                } catch(err) {
                    console.log("nested err888 babai ", err);
                }

            } catch (error) {
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroy();
                return;
            }
        };

        return server;
    }

    private async validateJwt(token: string): Promise<any> {
        if (token === 'valid-token') {
            return { id: 1, username: 'dev_user' };
        }
        throw new Error('Invalid token');
    }
}