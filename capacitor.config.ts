import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.birdie69.app",
  appName: "birdie69",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
