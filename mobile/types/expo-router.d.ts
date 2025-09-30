// types/expo-router.d.ts
import { RelativePathString } from "expo-router";

// Extend Expo Router's type definitions
declare module "expo-router" {
  interface RelativePathString {
    // Add your custom routes here
    "/(root)": never;
    "/(root)/": never;
  }
}
