import type { LucideIcon } from "lucide-react";
import {
  Waves, Mountain, Activity, CloudRain, Backpack, Radio, ArrowUpCircle, Zap, Droplets, Home,
  PhoneCall, TriangleAlert, Footprints, Car, Users, Ear, ShieldCheck, Shield, DoorOpen, Flame,
  Lightbulb, HeartPulse, Trees, Ban, MapPin, Siren, Hammer, Package, Baby,
} from "lucide-react";
import type { TKey } from "@/lib/i18n";

export type Phase = "before" | "during" | "after";
export interface Step { icon: LucideIcon; text: string }
export interface Guide {
  id: "flood" | "landslide" | "earthquake" | "cloudburst";
  titleKey: TKey;
  icon: LucideIcon;
  summary: string;
  phases: Record<Phase, Step[]>;
}

export const GUIDES: Guide[] = [
  {
    id: "flood",
    titleKey: "hazard.flood",
    icon: Waves,
    summary: "Rivers like the Brahmaputra can rise fast. Move early, move high.",
    phases: {
      before: [
        { icon: Backpack, text: "Pack your emergency kit and keep it near the door." },
        { icon: Package, text: "Put documents and medicines in a plastic bag." },
        { icon: MapPin, text: "Know the way to the nearest high ground or shelter." },
        { icon: Radio, text: "Listen to radio and village announcements for warnings." },
      ],
      during: [
        { icon: ArrowUpCircle, text: "Go to higher ground at once. Do not wait." },
        { icon: Zap, text: "Switch off electricity and gas if you can do it safely." },
        { icon: Ban, text: "Never walk or drive through moving water. 15 cm can knock you down." },
        { icon: Baby, text: "Keep children, elders and animals with you." },
      ],
      after: [
        { icon: Home, text: "Return home only when officials say it is safe." },
        { icon: Droplets, text: "Drink only boiled or bottled water." },
        { icon: Zap, text: "Do not touch wet wires or switches." },
        { icon: Shield, text: "Watch for snakes and sharp objects in mud." },
      ],
    },
  },
  {
    id: "landslide",
    titleKey: "hazard.landslide",
    icon: Mountain,
    summary: "Hill slopes in Arunachal, Nagaland and Mizoram slide after heavy rain.",
    phases: {
      before: [
        { icon: Ear, text: "Learn the signs: new cracks, tilting trees, muddy springs." },
        { icon: Trees, text: "Do not cut trees or dig at the base of slopes." },
        { icon: MapPin, text: "Know a safe place away from the slope path." },
        { icon: Backpack, text: "Keep your kit ready during the rainy season." },
      ],
      during: [
        { icon: Footprints, text: "Move away from the slide path, sideways, not downhill." },
        { icon: Ear, text: "Listen for rumbling or cracking. Leave at once." },
        { icon: Car, text: "If driving, watch for fallen rocks and broken road edges." },
        { icon: Shield, text: "If you cannot escape, curl into a ball and protect your head." },
      ],
      after: [
        { icon: TriangleAlert, text: "Stay away from the slide area. More slides can follow." },
        { icon: Users, text: "Check for injured or trapped people nearby. Call 112." },
        { icon: Siren, text: "Report broken roads, power lines and water pipes." },
        { icon: Hammer, text: "Get your house checked before going back inside." },
      ],
    },
  },
  {
    id: "earthquake",
    titleKey: "hazard.earthquake",
    icon: Activity,
    summary: "North East India is in the highest earthquake zone. Practise drop, cover, hold.",
    phases: {
      before: [
        { icon: Hammer, text: "Fix heavy shelves and gas cylinders to the wall." },
        { icon: Lightbulb, text: "Keep a torch and shoes near your bed." },
        { icon: Users, text: "Agree on a family meeting place outside." },
        { icon: ShieldCheck, text: "Find safe spots: under strong tables, away from glass." },
      ],
      during: [
        { icon: Shield, text: "DROP to the ground, take COVER under a table, HOLD ON." },
        { icon: Ban, text: "Do not run outside while the ground is shaking." },
        { icon: Trees, text: "If outside, move to open ground away from walls and wires." },
        { icon: Car, text: "If driving, stop away from bridges and slopes. Stay inside." },
      ],
      after: [
        { icon: TriangleAlert, text: "Expect aftershocks. Drop, cover, hold again." },
        { icon: Flame, text: "Check for gas smell. Do not light matches." },
        { icon: DoorOpen, text: "Leave damaged buildings carefully. Use stairs, not lifts." },
        { icon: HeartPulse, text: "Give first aid. Call 112 for serious injuries." },
      ],
    },
  },
  {
    id: "cloudburst",
    titleKey: "hazard.cloudburst",
    icon: CloudRain,
    summary: "Very heavy rain in a short time can cause sudden floods in hill valleys.",
    phases: {
      before: [
        { icon: Radio, text: "Watch for heavy rain warnings, especially at night." },
        { icon: Home, text: "Do not camp or stay near streams and dry riverbeds." },
        { icon: MapPin, text: "Plan an uphill route from your home." },
        { icon: PhoneCall, text: "Save 112 and 1077 in your phone." },
      ],
      during: [
        { icon: ArrowUpCircle, text: "Climb to higher ground immediately." },
        { icon: Ban, text: "Stay away from streams, culverts and narrow valleys." },
        { icon: Ear, text: "A loud roar upstream means water is coming. Move now." },
        { icon: Car, text: "Do not drive on flooded hill roads." },
      ],
      after: [
        { icon: TriangleAlert, text: "Wait for water to go down. Do not cross streams." },
        { icon: Mountain, text: "Watch for landslides on wet slopes." },
        { icon: Droplets, text: "Boil drinking water for at least one minute." },
        { icon: Users, text: "Check on neighbours, elders and children." },
      ],
    },
  },
];
