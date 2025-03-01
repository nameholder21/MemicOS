import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://memicos.org",
      lastModified: new Date(),
    },
  ];
}
