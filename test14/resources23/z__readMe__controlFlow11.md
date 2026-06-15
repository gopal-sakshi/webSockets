
`step__01`
Application is running on: http://localhost:17865
token rcvd 432432 ===>  subbarao_token
Tracked new connection233333333: k0vzzd
added new client subscription4 ===>  k0vzzd
subscribing to channel =======  webSockets_repo23:user23websocket-broadcast
Subscribed to Redis channel: webSockets_repo23:user23websocket-broadcast
Client k0vzzd subscirbed to channel: websocket-broadcast

`step__02`          <!-- send a msg from postman client to subscribe -->
added new client subscription3 ===>  {"action":"subscribe","channel":"user-123"} k0vzzd
subscribing to channel =======  webSockets_repo23:user23user-123
Subscribed to Redis channel: webSockets_repo23:user23user-123
Client k0vzzd subscirbed to channel: user-123

`step__03`
Received event from Kafka: {
  routingKey: 'user-123',
  stadium23: 'idi ra final flow -- jose mourinho2333'
}
topicKey ==========  user-123
publishing23 =======  {"routingKey":"user-123","stadium23":"idi ra final flow -- jose mourinho2333"}


