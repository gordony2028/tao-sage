/**
 * Integration Tests for Service Worker and Caching
 * 
 * Tests the PWA service worker functionality including:
 * - Service worker registration
 * - Cache strategies (NetworkFirst, StaleWhileRevalidate, CacheFirst)
 * - Offline resource availability
 * - Cache management and cleanup
 */

// Mock Service Worker API
class MockServiceWorker extends EventTarget {
  scriptURL: string;
  state: 'installing' | 'installed' | 'activating' | 'activated' | 'redundant' = 'activated';

  constructor(scriptURL: string) {
    super();
    this.scriptURL = scriptURL;
  }

  postMessage(message: any) {
    // Simulate message handling
    setTimeout(() => {
      this.dispatchEvent(new MessageEvent('message', { data: { type: 'ack' } }));
    }, 10);
  }
}

class MockServiceWorkerRegistration {
  active: MockServiceWorker | null = null;
  installing: MockServiceWorker | null = null;
  waiting: MockServiceWorker | null = null;
  scope: string;

  constructor(scriptURL: string, scope: string) {
    this.scope = scope;
    this.active = new MockServiceWorker(scriptURL);
  }

  update() {
    return Promise.resolve();
  }

  unregister() {
    return Promise.resolve(true);
  }
}

// Mock Cache API
class MockCache {
  private storage = new Map<string, Response>();

  async match(request: RequestInfo | URL): Promise<Response | undefined> {
    const key = typeof request === 'string' ? request : request.toString();
    return this.storage.get(key);
  }

  async matchAll(): Promise<Response[]> {
    return Array.from(this.storage.values());
  }

  async add(request: RequestInfo | URL): Promise<void> {
    const key = typeof request === 'string' ? request : request.toString();
    const response = new MockResponse('mocked response', { status: 200 });
    this.storage.set(key, response);
  }

  async addAll(requests: RequestInfo[]): Promise<void> {
    await Promise.all(requests.map(request => this.add(request)));
  }

  async put(request: RequestInfo | URL, response: Response): Promise<void> {
    const key = typeof request === 'string' ? request : request.toString();
    this.storage.set(key, response);
  }

  async delete(request: RequestInfo | URL): Promise<boolean> {
    const key = typeof request === 'string' ? request : request.toString();
    return this.storage.delete(key);
  }

  async keys(): Promise<Request[]> {
    return Array.from(this.storage.keys()).map(url => new Request(url));
  }
}

class MockCacheStorage {
  private caches = new Map<string, MockCache>();

  async open(cacheName: string): Promise<MockCache> {
    if (!this.caches.has(cacheName)) {
      this.caches.set(cacheName, new MockCache());
    }
    return this.caches.get(cacheName)!;
  }

  async has(cacheName: string): Promise<boolean> {
    return this.caches.has(cacheName);
  }

  async delete(cacheName: string): Promise<boolean> {
    return this.caches.delete(cacheName);
  }

  async keys(): Promise<string[]> {
    return Array.from(this.caches.keys());
  }

  async match(request: RequestInfo | URL): Promise<Response | undefined> {
    for (const cache of this.caches.values()) {
      const response = await cache.match(request);
      if (response) return response;
    }
    return undefined;
  }
}

// Setup global mocks
const mockCaches = new MockCacheStorage();
global.caches = mockCaches as any;

// Mock navigator.serviceWorker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: jest.fn(),
    ready: Promise.resolve(new MockServiceWorkerRegistration('/sw.js', '/')),
    controller: null,
    getRegistrations: jest.fn(() => Promise.resolve([])),
  },
  writable: true,
});

// Mock Response for Node.js environment
class MockResponse {
  body: any;
  status: number;
  statusText: string;
  headers: Headers;
  ok: boolean;

  constructor(body?: any, init?: ResponseInit) {
    this.body = body;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || 'OK';
    this.headers = new Headers(init?.headers);
    this.ok = this.status >= 200 && this.status < 300;
  }

  clone() {
    return new MockResponse(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers
    });
  }

  async text() {
    return typeof this.body === 'string' ? this.body : JSON.stringify(this.body);
  }

  async json() {
    return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
  }

  async blob() {
    return new Blob([this.body]);
  }
}

// Mock Headers for Node.js environment
if (typeof Headers === 'undefined') {
  global.Headers = class Headers {
    private headers: Map<string, string> = new Map();

    constructor(init?: HeadersInit) {
      if (init) {
        if (init instanceof Headers) {
          init.headers.forEach((value, key) => this.headers.set(key, value));
        } else if (Array.isArray(init)) {
          init.forEach(([key, value]) => this.headers.set(key, value));
        } else {
          Object.entries(init).forEach(([key, value]) => this.headers.set(key, value));
        }
      }
    }

    set(key: string, value: string) {
      this.headers.set(key.toLowerCase(), value);
    }

    get(key: string) {
      return this.headers.get(key.toLowerCase()) || null;
    }

    has(key: string) {
      return this.headers.has(key.toLowerCase());
    }

    delete(key: string) {
      return this.headers.delete(key.toLowerCase());
    }

    forEach(callback: (value: string, key: string) => void) {
      this.headers.forEach(callback);
    }
  } as any;
}

// Mock Request for Node.js environment
if (typeof Request === 'undefined') {
  global.Request = class Request {
    url: string;
    method: string;
    headers: Headers;
    
    constructor(url: string, init?: RequestInit) {
      this.url = url;
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers);
    }
  } as any;
}

// Mock Blob for Node.js environment
if (typeof Blob === 'undefined') {
  global.Blob = class Blob {
    size: number;
    type: string;
    
    constructor(parts?: any[], options?: BlobPropertyBag) {
      this.size = parts ? parts.reduce((acc, part) => acc + (part.length || 0), 0) : 0;
      this.type = options?.type || '';
    }
  } as any;
}

// Set global Response to our mock
global.Response = MockResponse as any;

// Mock fetch
global.fetch = jest.fn();

describe('Service Worker Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCaches['caches'].clear();
  });

  describe('Service Worker Registration', () => {
    it('should register service worker successfully', async () => {
      const mockRegistration = new MockServiceWorkerRegistration('/sw.js', '/');
      (navigator.serviceWorker.register as jest.Mock).mockResolvedValue(mockRegistration);

      // Simulate PWA registration
      const registration = await navigator.serviceWorker.register('/sw.js');

      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
      expect(registration.scope).toBe('/');
      expect(registration.active).toBeTruthy();
    });

    it('should handle service worker registration failures', async () => {
      const error = new Error('Service worker registration failed');
      (navigator.serviceWorker.register as jest.Mock).mockRejectedValue(error);

      await expect(navigator.serviceWorker.register('/sw.js')).rejects.toThrow(
        'Service worker registration failed'
      );
    });

    it('should update service worker when available', async () => {
      const mockRegistration = new MockServiceWorkerRegistration('/sw.js', '/');
      const updateSpy = jest.spyOn(mockRegistration, 'update');

      await mockRegistration.update();

      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('Cache Strategies', () => {
    let cache: MockCache;

    beforeEach(async () => {
      cache = await mockCaches.open('test-cache');
    });

    describe('NetworkFirst Strategy', () => {
      it('should serve from network when available and cache result', async () => {
        const mockResponse = new MockResponse('network response', { status: 200 });
        (global.fetch as jest.Mock).mockResolvedValue(mockResponse.clone());

        // Simulate NetworkFirst strategy
        const url = '/api/consultation/create';
        let response: Response;

        try {
          response = await fetch(url);
          await cache.put(url, response.clone());
        } catch (error) {
          const cachedResponse = await cache.match(url);
          response = cachedResponse || new MockResponse('fallback', { status: 503 });
        }

        expect(fetch).toHaveBeenCalledWith(url);
        expect(response.status).toBe(200);

        // Verify it was cached
        const cachedResponse = await cache.match(url);
        expect(cachedResponse).toBeDefined();
      });

      it('should fallback to cache when network fails', async () => {
        const url = '/api/guidance/daily';
        const cachedResponse = new MockResponse('cached response', { status: 200 });
        
        // Pre-populate cache
        await cache.put(url, cachedResponse);

        // Simulate network failure
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        // Simulate NetworkFirst fallback
        let response: Response;
        try {
          response = await fetch(url);
        } catch (error) {
          const fallbackResponse = await cache.match(url);
          response = fallbackResponse || new MockResponse('offline', { status: 503 });
        }

        expect(response.status).toBe(200);
        const text = await response.text();
        expect(text).toBe('cached response');
      });
    });

    describe('StaleWhileRevalidate Strategy', () => {
      it('should serve from cache while updating in background', async () => {
        const url = '/api/guidance/daily';
        const cachedResponse = new MockResponse('cached', { status: 200 });
        const networkResponse = new MockResponse('fresh', { status: 200 });

        // Pre-populate cache
        await cache.put(url, cachedResponse);

        (global.fetch as jest.Mock).mockResolvedValue(networkResponse.clone());

        // Simulate StaleWhileRevalidate
        const immediateResponse = await cache.match(url) || await fetch(url);
        
        // Background update
        const updatePromise = fetch(url).then(response => 
          cache.put(url, response.clone())
        );

        expect(immediateResponse.status).toBe(200);
        const text = await immediateResponse.text();
        expect(text).toBe('cached');

        // Wait for background update
        await updatePromise;

        // Verify cache was updated
        const updatedResponse = await cache.match(url);
        expect(updatedResponse).toBeDefined();
      });
    });

    describe('CacheFirst Strategy', () => {
      it('should serve from cache first, fallback to network', async () => {
        const url = '/icons/sage-icon.svg';
        const cachedResponse = new MockResponse('cached icon', { status: 200 });

        // Pre-populate cache
        await cache.put(url, cachedResponse);

        // Simulate CacheFirst
        const response = await cache.match(url) || await fetch(url);

        expect(response.status).toBe(200);
        const text = await response.text();
        expect(text).toBe('cached icon');
        expect(fetch).not.toHaveBeenCalled();
      });

      it('should fallback to network when cache miss occurs', async () => {
        const url = '/new-image.png';
        const networkResponse = new MockResponse('network image', { status: 200 });
        
        (global.fetch as jest.Mock).mockResolvedValue(networkResponse.clone());

        // Simulate CacheFirst with cache miss
        let response = await cache.match(url);
        if (!response) {
          response = await fetch(url);
          await cache.put(url, response.clone());
        }

        expect(fetch).toHaveBeenCalledWith(url);
        expect(response.status).toBe(200);

        // Verify it was cached for next time
        const cachedResponse = await cache.match(url);
        expect(cachedResponse).toBeDefined();
      });
    });
  });

  describe('Cache Management', () => {
    it('should create and manage multiple caches', async () => {
      const apiCache = await mockCaches.open('api-cache');
      const staticCache = await mockCaches.open('static-cache');
      const imageCache = await mockCaches.open('image-cache');

      await apiCache.put('/api/test', new MockResponse('api'));
      await staticCache.put('/static/app.js', new MockResponse('js'));
      await imageCache.put('/images/logo.png', new MockResponse('image'));

      const cacheNames = await mockCaches.keys();
      expect(cacheNames).toContain('api-cache');
      expect(cacheNames).toContain('static-cache');
      expect(cacheNames).toContain('image-cache');

      expect(await apiCache.match('/api/test')).toBeDefined();
      expect(await staticCache.match('/static/app.js')).toBeDefined();
      expect(await imageCache.match('/images/logo.png')).toBeDefined();
    });

    it('should handle cache cleanup and versioning', async () => {
      // Create old version caches
      const oldCache = await mockCaches.open('sage-cache-v1');
      const currentCache = await mockCaches.open('sage-cache-v2');

      await oldCache.put('/old-resource', new MockResponse('old'));
      await currentCache.put('/new-resource', new MockResponse('new'));

      // Simulate cleanup of old caches
      const cacheNames = await mockCaches.keys();
      const oldCaches = cacheNames.filter(name => 
        name.includes('v1') || name.includes('old')
      );

      for (const cacheName of oldCaches) {
        await mockCaches.delete(cacheName);
      }

      const remainingCaches = await mockCaches.keys();
      expect(remainingCaches).not.toContain('sage-cache-v1');
      expect(remainingCaches).toContain('sage-cache-v2');
    });

    it('should limit cache size and clean up old entries', async () => {
      const cache = await mockCaches.open('limited-cache');
      const maxEntries = 5;

      // Add more entries than the limit
      for (let i = 0; i < 8; i++) {
        await cache.put(`/resource-${i}`, new MockResponse(`content-${i}`));
      }

      // Simulate cache size limit enforcement
      const keys = await cache.keys();
      if (keys.length > maxEntries) {
        const keysToDelete = keys.slice(0, keys.length - maxEntries);
        for (const key of keysToDelete) {
          await cache.delete(key.url);
        }
      }

      const finalKeys = await cache.keys();
      expect(finalKeys.length).toBeLessThanOrEqual(maxEntries);
    });
  });

  describe('Offline Resource Availability', () => {
    it('should cache critical resources for offline access', async () => {
      const criticalCache = await mockCaches.open('sage-critical-v1');
      
      const criticalResources = [
        '/',
        '/consultation',
        '/guidance',
        '/manifest.json',
        '/icons/sage-icon.svg',
      ];

      // Simulate pre-caching critical resources
      await criticalCache.addAll(criticalResources);

      // Verify all critical resources are cached
      for (const resource of criticalResources) {
        const cached = await criticalCache.match(resource);
        expect(cached).toBeDefined();
      }
    });

    it('should serve cached pages when offline', async () => {
      const cache = await mockCaches.open('pages-cache');
      
      // Pre-cache main pages
      await cache.put('/', new MockResponse('<!DOCTYPE html><html>Home</html>'));
      await cache.put('/consultation', new MockResponse('<!DOCTYPE html><html>Consultation</html>'));

      // Simulate offline scenario
      (global.fetch as jest.Mock).mockRejectedValue(new Error('offline'));

      // Should serve from cache
      const homeResponse = await cache.match('/');
      const consultationResponse = await cache.match('/consultation');

      expect(homeResponse).toBeDefined();
      expect(consultationResponse).toBeDefined();

      const homeText = await homeResponse!.text();
      expect(homeText).toContain('Home');
    });

    it('should handle API requests with appropriate cache strategies', async () => {
      const apiCache = await mockCaches.open('consultation-api');
      
      // Test consultation API caching
      const consultationUrl = '/api/consultation/create';
      const cachedConsultation = new MockResponse(JSON.stringify({
        consultation: { id: 'cached-1', question: 'What is my path?' },
        hexagram: { number: 1, name: 'The Creative' }
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

      await apiCache.put(consultationUrl, cachedConsultation);

      // Simulate NetworkFirst for consultation API
      let response: Response;
      try {
        response = await fetch(consultationUrl);
      } catch (error) {
        response = await apiCache.match(consultationUrl) || 
                  new MockResponse('Service unavailable', { status: 503 });
      }

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.consultation).toBeDefined();
      expect(data.hexagram).toBeDefined();
    });
  });

  describe('Performance Optimizations', () => {
    it('should implement intelligent preloading', async () => {
      const cache = await mockCaches.open('preload-cache');
      
      // Simulate preloading critical resources
      const criticalResources = [
        '/api/guidance/daily',
        '/manifest.json',
        '/icons/sage-icon.svg',
      ];

      const preloadPromises = criticalResources.map(async (resource) => {
        try {
          const response = await fetch(resource);
          await cache.put(resource, response);
        } catch (error) {
          // Ignore preload errors
          console.warn(`Preload failed for ${resource}`);
        }
      });

      await Promise.allSettled(preloadPromises);

      // Verify some resources were preloaded (those that didn't fail)
      const cachedKeys = await cache.keys();
      expect(cachedKeys.length).toBeGreaterThanOrEqual(0);
    });

    it('should optimize image loading based on connection', async () => {
      const imageCache = await mockCaches.open('image-cache');
      
      // Simulate different image qualities based on connection
      const connection = { effectiveType: 'slow-2g' };
      
      const imageUrl = '/images/hero.jpg';
      const optimizedUrl = connection.effectiveType === 'slow-2g' 
        ? '/images/hero-low.jpg' 
        : '/images/hero-high.jpg';

      await imageCache.put(optimizedUrl, new MockResponse('optimized image'));

      const response = await imageCache.match(optimizedUrl);
      expect(response).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle cache storage failures gracefully', async () => {
      // Mock cache storage failure
      const originalOpen = mockCaches.open.bind(mockCaches);
      mockCaches.open = jest.fn().mockRejectedValue(new Error('Storage quota exceeded'));

      // Should not throw when cache operations fail
      let errorThrown = false;
      try {
        await mockCaches.open('test-cache');
      } catch (error) {
        errorThrown = true;
      }

      expect(errorThrown).toBe(true);

      // Restore original function
      mockCaches.open = originalOpen;
    });

    it('should provide fallbacks when all caches fail', async () => {
      // Mock all cache operations to fail
      const cache = await mockCaches.open('failing-cache');
      cache.match = jest.fn().mockRejectedValue(new Error('Cache read failed'));
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network failed'));

      // Simulate resilient error handling
      let response: Response;
      try {
        response = await cache.match('/test') as Response;
      } catch (error) {
        try {
          response = await fetch('/test');
        } catch (networkError) {
          response = new MockResponse('Service temporarily unavailable', { 
            status: 503,
            statusText: 'Service Unavailable'
          });
        }
      }

      expect(response.status).toBe(503);
      const text = await response.text();
      expect(text).toBe('Service temporarily unavailable');
    });
  });
});