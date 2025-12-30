# Server-Side Gantt Architecture with Next.js

## Overview
This document outlines how to build a server-protected Gantt chart service using Next.js that customers can embed in any framework (React, Vue, Angular, vanilla JS).

## Architecture Components

### 1. Core Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Your Infrastructure                    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │            Next.js App (Gantt Service)          │   │
│  │                                                  │   │
│  │  /api/render    → Calculate positions           │   │
│  │  /api/validate  → Check licenses                │   │
│  │  /api/export    → Generate PDF/Excel            │   │
│  │  /embed/:key    → iframe embed page             │   │
│  │  /sdk/gantt.js  → Client SDK                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Database (PostgreSQL)               │   │
│  │   licenses, usage_logs, customer_settings       │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

                           ↓ HTTPS

┌─────────────────────────────────────────────────────────┐
│                   Customer's App                         │
│                                                          │
│  React / Vue / Angular / Vanilla JS                     │
│  → Embeds via SDK or iframe                             │
│  → Sends tasks data                                     │
│  → Receives rendered Gantt                              │
└─────────────────────────────────────────────────────────┘
```

## Implementation

### Next.js API Routes Structure

```
/app
  /api
    /v1
      /render
        route.ts        # POST: Calculate Gantt positions
      /validate
        route.ts        # POST: Validate license
      /export
        route.ts        # POST: Export to PDF/Excel
      /critical-path
        route.ts        # POST: Calculate critical path
  /embed
    /[licenseKey]
      page.tsx          # iframe embed page
  /sdk
    gantt.js           # Client SDK (served as static file)
```

### 1. License Validation API

```typescript
// app/api/v1/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = request.ip || 'unknown';
  
  // Rate limiting
  const { success } = await rateLimit.check(ip);
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }

  const { licenseKey, domain } = await request.json();

  // Validate license in database
  const license = await db.license.findUnique({
    where: { key: licenseKey }
  });

  if (!license) {
    return NextResponse.json(
      { valid: false, error: 'Invalid license' },
      { status: 403 }
    );
  }

  // Check domain restrictions
  if (license.allowedDomains && !license.allowedDomains.includes(domain)) {
    return NextResponse.json(
      { valid: false, error: 'Domain not allowed' },
      { status: 403 }
    );
  }

  // Check expiration
  if (license.expiresAt < new Date()) {
    return NextResponse.json(
      { valid: false, error: 'License expired' },
      { status: 403 }
    );
  }

  // Log usage
  await db.usageLog.create({
    data: {
      licenseId: license.id,
      action: 'validate',
      domain,
      ip,
      timestamp: new Date()
    }
  });

  return NextResponse.json({
    valid: true,
    features: license.features,
    expiresAt: license.expiresAt
  });
}
```

### 2. Render API (Core Business Logic)

```typescript
// app/api/v1/render/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GanttEngine } from '@/lib/gantt-engine';
import { validateLicense } from '@/lib/license';

export async function POST(request: NextRequest) {
  const { licenseKey, tasks, config } = await request.json();

  // Validate license
  const license = await validateLicense(licenseKey);
  if (!license.valid) {
    return NextResponse.json(
      { error: 'Invalid license' },
      { status: 403 }
    );
  }

  // Apply license restrictions
  if (!license.features.includes('unlimited-tasks') && tasks.length > 100) {
    return NextResponse.json(
      { error: 'Task limit exceeded. Upgrade to Pro.' },
      { status: 403 }
    );
  }

  // Core Gantt calculations (server-side only)
  const engine = new GanttEngine(config);
  const renderData = engine.calculate({
    tasks,
    viewRange: config.viewRange,
    dependencies: config.dependencies
  });

  // Add watermark for trial licenses
  if (license.type === 'trial') {
    renderData.watermark = 'Trial Version - ' + license.company;
  }

  // Log API usage for billing
  await logUsage(licenseKey, 'render', tasks.length);

  return NextResponse.json({
    success: true,
    data: renderData,
    usage: {
      tasksProcessed: tasks.length,
      creditsUsed: calculateCredits(tasks.length)
    }
  });
}
```

### 3. Client SDK (Embeddable in Any Framework)

```javascript
// public/sdk/gantt.js
(function(window) {
  'use strict';

  class GanttPro {
    constructor(config) {
      this.licenseKey = config.licenseKey;
      this.container = config.container;
      this.apiUrl = config.apiUrl || 'https://gantt.yourservice.com/api/v1';
      this.tasks = [];
      this.config = config;
      
      // Validate on init
      this.validate();
    }

    async validate() {
      const response = await fetch(`${this.apiUrl}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseKey: this.licenseKey,
          domain: window.location.hostname
        })
      });

      if (!response.ok) {
        this.renderError('Invalid license key');
        return false;
      }

      const data = await response.json();
      this.features = data.features;
      return true;
    }

    async render(tasks) {
      this.tasks = tasks;
      
      // Show loading
      this.showLoading();

      // Call render API
      const response = await fetch(`${this.apiUrl}/render`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseKey: this.licenseKey,
          tasks: this.tasks,
          config: this.config
        })
      });

      if (!response.ok) {
        const error = await response.json();
        this.renderError(error.error);
        return;
      }

      const { data } = await response.json();
      this.drawGantt(data);
    }

    drawGantt(renderData) {
      const container = document.querySelector(this.container);
      
      // Create SVG or Canvas
      const svg = this.createSVG(renderData);
      
      // Add watermark if present
      if (renderData.watermark) {
        this.addWatermark(svg, renderData.watermark);
      }
      
      container.innerHTML = '';
      container.appendChild(svg);
      
      // Attach event handlers
      this.attachEvents(svg);
    }

    createSVG(data) {
      // SVG rendering logic
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      // ... rendering implementation
      return svg;
    }

    // Framework-agnostic event handling
    on(event, callback) {
      this.events = this.events || {};
      this.events[event] = callback;
    }

    // Export functionality (server-side)
    async export(format) {
      const response = await fetch(`${this.apiUrl}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseKey: this.licenseKey,
          tasks: this.tasks,
          format: format
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        this.downloadBlob(blob, `gantt.${format}`);
      }
    }

    downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  // AMD support
  if (typeof define === 'function' && define.amd) {
    define([], function() { return GanttPro; });
  }
  // CommonJS support
  else if (typeof exports !== 'undefined') {
    exports.GanttPro = GanttPro;
  }
  // Browser global
  else {
    window.GanttPro = GanttPro;
  }

})(typeof window !== 'undefined' ? window : this);
```

### 4. iframe Embed Option

```typescript
// app/embed/[licenseKey]/page.tsx
import { validateLicense } from '@/lib/license';
import { GanttEmbed } from '@/components/GanttEmbed';

export default async function EmbedPage({ 
  params,
  searchParams 
}: {
  params: { licenseKey: string };
  searchParams: { config?: string };
}) {
  const license = await validateLicense(params.licenseKey);
  
  if (!license.valid) {
    return <div>Invalid license key</div>;
  }

  // Parse config from query string
  const config = searchParams.config 
    ? JSON.parse(decodeURIComponent(searchParams.config))
    : {};

  return (
    <html>
      <head>
        <style>{`
          body { margin: 0; font-family: system-ui; }
          .watermark { position: absolute; top: 10px; right: 10px; }
        `}</style>
      </head>
      <body>
        <GanttEmbed 
          license={license}
          config={config}
        />
        {license.type === 'trial' && (
          <div className="watermark">Trial Version</div>
        )}
        
        <script>{`
          // PostMessage API for parent communication
          window.addEventListener('message', (event) => {
            if (event.data.type === 'UPDATE_TASKS') {
              window.updateGantt(event.data.tasks);
            }
          });
          
          // Notify parent when ready
          window.parent.postMessage({ type: 'GANTT_READY' }, '*');
        `}</script>
      </body>
    </html>
  );
}
```

## Customer Integration Examples

### React Integration

```jsx
// Customer's React app
import { useEffect, useRef } from 'react';

function MyGanttChart({ tasks }) {
  const containerRef = useRef();
  const ganttRef = useRef();

  useEffect(() => {
    // Load SDK dynamically
    const script = document.createElement('script');
    script.src = 'https://gantt.yourservice.com/sdk/gantt.js';
    script.onload = () => {
      ganttRef.current = new window.GanttPro({
        licenseKey: 'XXXX-XXXX-XXXX',
        container: containerRef.current,
        apiUrl: 'https://gantt.yourservice.com/api/v1'
      });
      
      ganttRef.current.render(tasks);
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  useEffect(() => {
    if (ganttRef.current) {
      ganttRef.current.render(tasks);
    }
  }, [tasks]);

  return <div ref={containerRef} style={{ height: 600 }} />;
}
```

### Vue Integration

```vue
<!-- Customer's Vue app -->
<template>
  <div ref="ganttContainer" class="gantt-chart"></div>
</template>

<script>
export default {
  props: ['tasks'],
  mounted() {
    // Load SDK
    const script = document.createElement('script');
    script.src = 'https://gantt.yourservice.com/sdk/gantt.js';
    script.onload = () => {
      this.gantt = new window.GanttPro({
        licenseKey: 'XXXX-XXXX-XXXX',
        container: this.$refs.ganttContainer
      });
      
      this.gantt.render(this.tasks);
    };
    document.head.appendChild(script);
  },
  watch: {
    tasks(newTasks) {
      if (this.gantt) {
        this.gantt.render(newTasks);
      }
    }
  }
};
</script>
```

### Angular Integration

```typescript
// Customer's Angular app
import { Component, Input, OnInit, ElementRef } from '@angular/core';

declare var GanttPro: any;

@Component({
  selector: 'app-gantt',
  template: '<div #ganttContainer></div>'
})
export class GanttComponent implements OnInit {
  @Input() tasks: any[];
  private gantt: any;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Load SDK dynamically
    const script = document.createElement('script');
    script.src = 'https://gantt.yourservice.com/sdk/gantt.js';
    script.onload = () => {
      this.gantt = new GanttPro({
        licenseKey: 'XXXX-XXXX-XXXX',
        container: this.el.nativeElement.querySelector('div')
      });
      
      this.gantt.render(this.tasks);
    };
    document.head.appendChild(script);
  }

  ngOnChanges() {
    if (this.gantt && this.tasks) {
      this.gantt.render(this.tasks);
    }
  }
}
```

### Vanilla JavaScript

```html
<!-- Customer's HTML -->
<!DOCTYPE html>
<html>
<head>
  <script src="https://gantt.yourservice.com/sdk/gantt.js"></script>
</head>
<body>
  <div id="gantt-chart"></div>
  
  <script>
    const gantt = new GanttPro({
      licenseKey: 'XXXX-XXXX-XXXX',
      container: '#gantt-chart',
      config: {
        viewMode: 'week',
        showDependencies: true
      }
    });

    // Load tasks from their backend
    fetch('/api/tasks')
      .then(res => res.json())
      .then(tasks => gantt.render(tasks));

    // Handle task updates
    gantt.on('taskUpdate', (task) => {
      fetch('/api/tasks/' + task.id, {
        method: 'PUT',
        body: JSON.stringify(task)
      });
    });
  </script>
</body>
</html>
```

### iframe Integration (Simplest)

```html
<!-- Any framework/no framework -->
<iframe 
  src="https://gantt.yourservice.com/embed/XXXX-XXXX-XXXX"
  width="100%"
  height="600"
  frameborder="0"
></iframe>

<script>
  // Optional: Send data via postMessage
  const iframe = document.querySelector('iframe');
  iframe.onload = () => {
    iframe.contentWindow.postMessage({
      type: 'UPDATE_TASKS',
      tasks: [
        { id: 1, name: 'Task 1', start: '2024-01-01', end: '2024-01-07' }
      ]
    }, '*');
  };
</script>
```

## NPM Package Distribution

For better DX, also provide an NPM package that wraps the SDK:

```typescript
// @ganttpro/client package
export class GanttProClient {
  private scriptLoaded = false;
  private gantt: any;

  constructor(private config: GanttConfig) {}

  async init() {
    if (!this.scriptLoaded) {
      await this.loadScript();
      this.scriptLoaded = true;
    }

    this.gantt = new (window as any).GanttPro(this.config);
    return this;
  }

  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = this.config.sdkUrl || 'https://gantt.yourservice.com/sdk/gantt.js';
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  render(tasks: Task[]) {
    return this.gantt.render(tasks);
  }

  export(format: 'pdf' | 'excel' | 'png') {
    return this.gantt.export(format);
  }

  on(event: string, handler: Function) {
    return this.gantt.on(event, handler);
  }
}

// React wrapper
export function useGanttPro(config: GanttConfig) {
  const [gantt, setGantt] = useState<GanttProClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = new GanttProClient(config);
    client.init().then(() => {
      setGantt(client);
      setLoading(false);
    });
  }, []);

  return { gantt, loading };
}
```

## Database Schema

```sql
-- PostgreSQL schema
CREATE TABLE licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  company VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'trial', 'pro', 'enterprise'
  features JSONB DEFAULT '[]',
  allowed_domains JSONB DEFAULT '[]',
  max_api_calls INTEGER DEFAULT 10000,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID REFERENCES licenses(id),
  action VARCHAR(100) NOT NULL,
  domain VARCHAR(255),
  ip VARCHAR(45),
  metadata JSONB,
  credits_used INTEGER DEFAULT 1,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_logs_license_timestamp 
  ON usage_logs(license_id, timestamp DESC);

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID REFERENCES licenses(id),
  key_hash VARCHAR(255) NOT NULL,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

```bash
# .env.local
DATABASE_URL=postgresql://user:password@localhost:5432/gantt
REDIS_URL=redis://localhost:6379
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
POSTMARK_API_KEY=...

# Rate limiting
RATE_LIMIT_WINDOW=60000  # 1 minute
RATE_LIMIT_MAX_REQUESTS=100

# Encryption for sensitive data
ENCRYPTION_KEY=...
```

## Deployment on Vercel

```json
// vercel.json
{
  "functions": {
    "app/api/v1/render/route.ts": {
      "maxDuration": 30
    },
    "app/api/v1/export/route.ts": {
      "maxDuration": 60
    }
  },
  "crons": [
    {
      "path": "/api/cron/usage-report",
      "schedule": "0 0 * * *"
    }
  ]
}
```

## Security Considerations

### CORS Configuration

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Allow specific origins for API
  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin');
    
    // For development
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('Access-Control-Allow-Origin', '*');
    } else {
      // For production - validate against license domains
      // Check if origin is in allowed domains for the license
      response.headers.set('Access-Control-Allow-Origin', origin || '*');
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }
  
  // iframe embed security
  if (request.nextUrl.pathname.startsWith('/embed')) {
    // Allow embedding from anywhere (they need valid license)
    response.headers.delete('X-Frame-Options');
  }
  
  return response;
}

export const config = {
  matcher: ['/api/:path*', '/embed/:path*']
};
```

### Rate Limiting

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
});

// Different limits for different endpoints
export const renderRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1000, '1 h'), // 1000 renders per hour
});

export const exportRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 exports per hour
});
```

## Monitoring & Analytics

```typescript
// lib/analytics.ts
import { PostHog } from 'posthog-node';

const posthog = new PostHog(process.env.POSTHOG_KEY!);

export async function trackUsage(
  licenseKey: string,
  event: string,
  properties?: any
) {
  await posthog.capture({
    distinctId: licenseKey,
    event: `gantt_${event}`,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
      version: process.env.GANTT_VERSION
    }
  });
}

// Track API usage for billing
export async function trackAPICall(
  licenseKey: string,
  endpoint: string,
  credits: number
) {
  await db.usageLog.create({
    data: {
      licenseKey,
      endpoint,
      credits,
      timestamp: new Date()
    }
  });
  
  // Check if approaching limits
  const usage = await getMonthlyUsage(licenseKey);
  if (usage > limit * 0.8) {
    await sendUsageWarningEmail(licenseKey);
  }
}
```

## Pricing Tiers

```typescript
// config/pricing.ts
export const PRICING_TIERS = {
  trial: {
    price: 0,
    duration: 14, // days
    maxTasks: 50,
    maxApiCalls: 1000,
    features: ['basic_gantt', 'dependencies'],
    watermark: true
  },
  starter: {
    price: 99, // per month
    maxTasks: 200,
    maxApiCalls: 10000,
    features: ['basic_gantt', 'dependencies', 'export_png'],
    watermark: false
  },
  professional: {
    price: 299,
    maxTasks: 1000,
    maxApiCalls: 100000,
    features: [
      'basic_gantt', 
      'dependencies', 
      'critical_path',
      'resource_management',
      'export_pdf',
      'export_excel',
      'custom_styling'
    ],
    watermark: false
  },
  enterprise: {
    price: 'custom',
    maxTasks: Infinity,
    maxApiCalls: Infinity,
    features: ['all'],
    watermark: false,
    sla: true,
    selfHosted: true
  }
};
```

## Benefits of This Architecture

1. **Unhackable** - Core logic runs server-side
2. **Framework Agnostic** - Works with any frontend
3. **Easy Integration** - Simple SDK or iframe
4. **Usage Tracking** - Perfect analytics and billing
5. **Instant Updates** - No client updates needed
6. **Performance** - CDN for SDK, server caching
7. **Security** - License validation, rate limiting
8. **Scalable** - Vercel auto-scaling, edge functions

## Getting Started for Customers

```bash
# Option 1: NPM Package
npm install @ganttpro/client

# Option 2: CDN
<script src="https://cdn.ganttpro.com/v1/gantt.min.js"></script>

# Option 3: iframe (no installation)
<iframe src="https://gantt.yourservice.com/embed/LICENSE_KEY"></iframe>
```

Then initialize with their license key and start using immediately.