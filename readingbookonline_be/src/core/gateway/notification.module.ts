import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationModule } from '@features/notification/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [NotificationGateway],
  exports: [NotificationGateway],
})
export class NotificationGatewayModule {} 