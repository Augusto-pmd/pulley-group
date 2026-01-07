/**
 * Instrumentación para capturar network, console y errores
 */

import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface NetworkLog {
  method: string;
  url: string;
  status: number | null;
  timestamp: string;
  error?: string;
}

export interface ConsoleLog {
  type: string;
  text: string;
  timestamp: string;
}

export class TestInstrumentation {
  private networkLogs: NetworkLog[] = [];
  private consoleLogs: ConsoleLog[] = [];
  private requestFailedLogs: NetworkLog[] = [];
  private reportDir: string;

  constructor(reportDir: string = 'qa-e2e') {
    this.reportDir = reportDir;
    // Crear directorio si no existe
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  setup(page: Page) {
    // Capturar requests
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('/api/')) {
        this.networkLogs.push({
          method: request.method(),
          url,
          status: null, // Se completará en response
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Capturar responses
    page.on('response', (response) => {
      const url = response.url();
      if (url.includes('/api/')) {
        const status = response.status();
        const log = this.networkLogs.find(l => l.url === url && l.status === null);
        if (log) {
          log.status = status;
        } else {
          this.networkLogs.push({
            method: response.request().method(),
            url,
            status,
            timestamp: new Date().toISOString(),
          });
        }

        // Registrar errores 4xx/5xx
        if (status >= 400) {
          this.requestFailedLogs.push({
            method: response.request().method(),
            url,
            status,
            timestamp: new Date().toISOString(),
            error: `HTTP ${status}`,
          });
        }
      }
    });

    // Capturar request failures
    page.on('requestfailed', (request) => {
      const url = request.url();
      if (url.includes('/api/')) {
        this.requestFailedLogs.push({
          method: request.method(),
          url,
          status: null,
          timestamp: new Date().toISOString(),
          error: request.failure()?.errorText || 'Request failed',
        });
      }
    });

    // Capturar console
    page.on('console', (msg) => {
      this.consoleLogs.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString(),
      });
    });
  }

  getApiRequests(): NetworkLog[] {
    return this.networkLogs.filter(log => log.url.includes('/api/'));
  }

  getFailedRequests(): NetworkLog[] {
    return this.requestFailedLogs;
  }

  getConsoleErrors(): ConsoleLog[] {
    return this.consoleLogs.filter(log => log.type === 'error');
  }

  async saveLogs(testName: string) {
    const safeTestName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    // Guardar network log
    const networkLogPath = path.join(this.reportDir, `${safeTestName}-network.log`);
    fs.writeFileSync(
      networkLogPath,
      JSON.stringify(this.networkLogs, null, 2)
    );

    // Guardar console log
    const consoleLogPath = path.join(this.reportDir, `${safeTestName}-console.log`);
    fs.writeFileSync(
      consoleLogPath,
      JSON.stringify(this.consoleLogs, null, 2)
    );

    return {
      networkLog: networkLogPath,
      consoleLog: consoleLogPath,
    };
  }

  clear() {
    this.networkLogs = [];
    this.consoleLogs = [];
    this.requestFailedLogs = [];
  }

  async waitForApiRequest(
    page: Page,
    method: string,
    urlPattern: string | RegExp,
    timeout: number = 10000
  ): Promise<NetworkLog | null> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const matching = this.networkLogs.find(log => {
        const methodMatch = log.method === method;
        const urlMatch = typeof urlPattern === 'string'
          ? log.url.includes(urlPattern)
          : urlPattern.test(log.url);
        return methodMatch && urlMatch && log.status !== null;
      });
      if (matching) return matching;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return null;
  }
}

