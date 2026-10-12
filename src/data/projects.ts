export const projectSlugs = ["cardio-k", "neomove", "omnisense"] as const;

export type ProjectSlug = (typeof projectSlugs)[number];

export function isProjectSlug(value: string): value is ProjectSlug {
  return (projectSlugs as readonly string[]).includes(value);
}

export function nextProject(slug: ProjectSlug): ProjectSlug {
  const i = projectSlugs.indexOf(slug);
  return projectSlugs[(i + 1) % projectSlugs.length];
}

export const projectMedia: Record<ProjectSlug, { image: string; width: number; height: number; number: string }> = {
  "cardio-k": { image: "/images/products/cardiok-sensor.png", width: 552, height: 602, number: "01" },
  neomove: { image: "/images/products/neomove-bed.jpg", width: 1468, height: 1192, number: "02" },
  omnisense: { image: "/images/products/omnisense-hero.jpg", width: 1188, height: 1028, number: "03" },
};

export const galleryImages = [
  { src: "/images/events/event-1.jpg", width: 396, height: 524 },
  { src: "/images/events/event-2.jpg", width: 792, height: 528 },
  { src: "/images/events/event-3.jpg", width: 396, height: 528 },
  { src: "/images/events/event-4.jpg", width: 634, height: 426 },
  { src: "/images/events/event-5.jpg", width: 762, height: 426 },
  { src: "/images/events/event-6.jpg", width: 638, height: 426 },
] as const;

export const CONTACT_EMAIL = "soulcompany.om@gmail.com";
