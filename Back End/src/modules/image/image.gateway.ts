import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GetResizedImageService } from './services/get-resized-image/get-resized-image.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000'
  }
})
export class ImageGateway {
  constructor(
    private readonly getResizedImageService: GetResizedImageService
  ) { }

  @SubscribeMessage('resized')
  async handleResized(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    payload: { processId: string }
  ) {
    const result = await this.getResizedImageService.getResizedImage(payload.processId);
    client.emit('response', result);
  }
}
