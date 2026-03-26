// Rate limiting to prevent abuse

export interface RateLimitResult {
  allowed: boolean;
  remainingRequests?: number;
  resetTime?: Date;
  reason?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: Date;
}

export class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  
  // Default limits
  private readonly MAX_REQUESTS_PER_MINUTE = 10;
  private readonly MAX_REQUESTS_PER_HOUR = 100;
  private readonly MAX_REQUESTS_PER_DAY = 500;

  /**
   * Check if request is allowed for given identifier (e.g., student ID, IP)
   */
  checkLimit(
    identifier: string,
    timeWindow: 'minute' | 'hour' | 'day' = 'minute'
  ): RateLimitResult {
    const key = `${identifier}:${timeWindow}`;
    const now = new Date();
    
    // Get or create entry
    let entry = this.limits.get(key);
    
    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      const resetTime = this.getResetTime(timeWindow);
      entry = { count: 0, resetTime };
      this.limits.set(key, entry);
    }

    // Check limit
    const maxRequests = this.getMaxRequests(timeWindow);
    
    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remainingRequests: 0,
        resetTime: entry.resetTime,
        reason: `Rate limit exceeded: ${maxRequests} requests per ${timeWindow}`
      };
    }

    // Increment count
    entry.count++;
    
    return {
      allowed: true,
      remainingRequests: maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  /**
   * Reset limit for identifier
   */
  resetLimit(identifier: string, timeWindow?: 'minute' | 'hour' | 'day'): void {
    if (timeWindow) {
      const key = `${identifier}:${timeWindow}`;
      this.limits.delete(key);
    } else {
      // Reset all time windows for identifier
      ['minute', 'hour', 'day'].forEach(window => {
        const key = `${identifier}:${window}`;
        this.limits.delete(key);
      });
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = new Date();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }

  private getMaxRequests(timeWindow: 'minute' | 'hour' | 'day'): number {
    switch (timeWindow) {
      case 'minute':
        return this.MAX_REQUESTS_PER_MINUTE;
      case 'hour':
        return this.MAX_REQUESTS_PER_HOUR;
      case 'day':
        return this.MAX_REQUESTS_PER_DAY;
    }
  }

  private getResetTime(timeWindow: 'minute' | 'hour' | 'day'): Date {
    const now = new Date();
    switch (timeWindow) {
      case 'minute':
        return new Date(now.getTime() + 60 * 1000);
      case 'hour':
        return new Date(now.getTime() + 60 * 60 * 1000);
      case 'day':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }
}

// Singleton instance
let rateLimiter: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (!rateLimiter) {
    rateLimiter = new RateLimiter();
    
    // Cleanup expired entries every 5 minutes
    if (typeof setInterval !== 'undefined') {
      setInterval(() => rateLimiter?.cleanup(), 5 * 60 * 1000);
    }
  }
  return rateLimiter;
}
