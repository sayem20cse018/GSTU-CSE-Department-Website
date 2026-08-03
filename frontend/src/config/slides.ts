/**
 * Hero slider configuration.
 * Admin can edit this file to add/remove/reorder slides.
 * Each slide can have an image URL (use CDN/Cloudinary/S3).
 * If imageUrl is empty, a gradient fallback is shown.
 */

export interface Slide {
  id:         string;
  imageUrl:   string;       // full-size background image URL
  overlayOpacity: number;   // 0–100, e.g. 60 = 60% dark overlay
  tag?:       string;       // small label above title e.g. "Welcome to"
  title:      string;
  subtitle:   string;
  primaryBtn?: { label: string; href: string };
  secondaryBtn?: { label: string; href: string };
  align:      'left' | 'center';  // text alignment
}

export const HERO_SLIDES: Slide[] = [
  {
    id: 'slide-1',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80',
    overlayOpacity: 65,
    tag: 'Welcome to',
    title: 'Department of Computer Science & Engineering',
    subtitle: 'Advancing Computing, Shaping the Future. Cultivating the next generation of innovators, researchers, and technology leaders at GSTU.',
    primaryBtn:   { label: 'Explore Programs', href: '/academics' },
    secondaryBtn: { label: 'Our Research',      href: '/research' },
    align: 'left',
  },
  {
    id: 'slide-2',
   imageUrl: "/ACADEMIC.JPG",
    overlayOpacity: 60,
    tag: 'ACADEMIC BUILDING',
    title: 'ACADEMIC BUILDING',
    subtitle: 'Our faculty and students are engaged in cutting-edge research in AI, Machine Learning, Cybersecurity, IoT and more.',
    primaryBtn:   { label: 'View Research', href: '/research' },
    secondaryBtn: { label: 'Faculty Members', href: '/faculty' },
    align: 'left',
  },
  {
    id: 'slide-3',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1600&q=80',
    overlayOpacity: 60,
    tag: 'BSc · MSc · PhD',
    title: 'Academic Excellence Since 2011',
    subtitle: 'Choose from world-class undergraduate and graduate programs designed to prepare you for success in the global technology industry.',
    primaryBtn:   { label: 'Apply Now',        href: '/admissions' },
    secondaryBtn: { label: 'Academic Programs', href: '/academics' },
    align: 'left',
  },
  {
    id: 'slide-4',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&q=80',
    overlayOpacity: 65,
    tag: 'State-of-the-Art Labs',
    title: 'Learn, Build & Innovate',
    subtitle: 'Access modern laboratories equipped with the latest tools and technologies for hands-on learning and cutting-edge research.',
    primaryBtn:   { label: 'Explore Labs', href: '/academics/labs' },
    secondaryBtn: { label: 'Contact Us',   href: '/contact' },
    align: 'center',
  },
];
