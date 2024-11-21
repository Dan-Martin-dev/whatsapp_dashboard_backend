import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private blacklist: Set<string> = new Set();

  // Add token to blacklist
  addToken(token: string) {
    this.blacklist.add(token);
  }

  // Check if token is blacklisted
  isBlacklisted(token: string): boolean {
    return this.blacklist.has(token);
  }
}
