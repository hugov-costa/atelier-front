interface AuthCacheEntry {
  isAuthenticated: boolean;
  timestamp: number;
}

const THIRTY_SECONDS_IN_MILLISECONDS = 30 * 1000;
const ONE_HOUR_IN_MILLISECONDS = 60 * 60 * 1000;
const MAXIMUM_CACHE_SIZE = 100;

class AuthCache {
  private readonly entries = new Map<string, AuthCacheEntry>();
  private readonly timeToLive = THIRTY_SECONDS_IN_MILLISECONDS;
  private readonly maximumSize = MAXIMUM_CACHE_SIZE;
  private cleanupIntervalId?: ReturnType<typeof setInterval>;
  private lastToken: string | null = null;

  get(token: string): boolean | null {
    this.resetCacheWhenTokenChanges(token);

    const entry = this.entries.get(token);

    if (!entry) {
      return null;
    }

    if (this.isExpired(entry)) {
      this.entries.delete(token);
      return null;
    }

    return entry.isAuthenticated;
  }

  set(token: string, isAuthenticated: boolean): void {
    this.resetCacheWhenTokenChanges(token);
    this.ensureCacheCapacity();
    this.entries.set(token, { isAuthenticated, timestamp: Date.now() });
  }

  delete(token: string): void {
    this.entries.delete(token);
  }

  startAutoCleanup(intervalMs: number = ONE_HOUR_IN_MILLISECONDS): void {
    if (this.cleanupIntervalId) {
      return;
    }

    this.cleanupIntervalId = setInterval(() => {
      this.removeExpiredEntries();
    }, intervalMs);
  }

  private resetCacheWhenTokenChanges(token: string): void {
    if (this.lastToken !== null && token !== this.lastToken) {
      this.entries.clear();
    }

    this.lastToken = token;
  }

  private isExpired(entry: AuthCacheEntry): boolean {
    return Date.now() - entry.timestamp > this.timeToLive;
  }

  private ensureCacheCapacity(): void {
    if (this.entries.size < this.maximumSize) {
      return;
    }

    const oldestToken = this.entries.keys().next().value;

    if (oldestToken) {
      this.entries.delete(oldestToken);
    }
  }

  private removeExpiredEntries(): void {
    for (const [token, entry] of this.entries.entries()) {
      if (this.isExpired(entry)) {
        this.entries.delete(token);
      }
    }
  }
}

export const authCache = new AuthCache();

authCache.startAutoCleanup();
