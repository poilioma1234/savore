type ProxyMode = "local" | "server";

interface ProxyConfig {
  local: {
    baseURL: string;
    timeout: number;
  };
  server: {
    baseURL: string;
    timeout: number;
  };
}

const config: ProxyConfig = {
  local: {
    baseURL: "http://localhost:3001",
    timeout: 10000,
  },
  server: {
    baseURL: "https://api.saas-wms.com",
    timeout: 15000,
  },
};

class ProxyConfigManager {
  private currentMode: ProxyMode = "local"; // Changed to local by default

  constructor() {
    // Initialize from localStorage if available
    const savedMode = localStorage.getItem("apiTarget") as ProxyMode;
    if (savedMode && (savedMode === "local" || savedMode === "server")) {
      this.currentMode = savedMode;
    }
  }

  setProxyMode(mode: ProxyMode): void {
    this.currentMode = mode;
    localStorage.setItem("apiTarget", mode);
  }

  getProxyMode(): ProxyMode {
    return this.currentMode;
  }

  getBaseUrl(): string {
    return config[this.currentMode].baseURL;
  }

  getTimeout(): number {
    return config[this.currentMode].timeout;
  }

  getApiUrl(endpoint: string): string {
    return `${this.getBaseUrl()}${endpoint}`;
  }
}

export const proxyConfig = new ProxyConfigManager();
