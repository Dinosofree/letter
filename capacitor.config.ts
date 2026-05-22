import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.letterarchive.app",
  appName: "信件档案",
  webDir: "capacitor-web",
  server: {
    url: "https://letter-archive.vercel.app",
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
