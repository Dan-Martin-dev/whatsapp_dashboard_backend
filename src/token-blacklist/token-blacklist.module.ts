import { Module } from '@nestjs/common';
import { TokenBlacklistService } from './token-blacklist.service';

@Module({
  providers: [TokenBlacklistService],
  exports: [TokenBlacklistService], // Export the service so it can be used elsewhere
})
export class TokenBlacklistModule {}
