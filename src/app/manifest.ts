import type { MetadataRoute } from "next";
import { appName } from "@/config/app";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: appName,
    short_name: appName,
    description: "Learning games and a safe AI buddy for kids, with parents in control.",
    // Dalla Home si apre direttamente la scelta del profilo del bambino.
    start_url: "/play",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#fff8ee",
    theme_color: "#fff8ee",
    categories: ["education", "kids"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
