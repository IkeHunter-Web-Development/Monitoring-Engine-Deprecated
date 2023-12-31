import { HOST, PORT, server, setupDatabase, Socket } from "src/config";

import { registerConsumers } from "./data";
import "src/config/socket";

setupDatabase();
registerConsumers();

Socket.createSocket(server);

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
  // socket.on('connection', () => {
  //   console.log('Websocket has received a new connection')
  // })
});

export default server;
