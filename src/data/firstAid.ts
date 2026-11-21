import type { LucideIcon } from "lucide-react";
import { Droplet, Bone, Snowflake, Waves } from "lucide-react";
import type { TKey } from "@/lib/i18n";

export interface FirstAidGuide {
  id: string;
  titleKey: TKey;
  icon: LucideIcon;
  urgent: string;
  steps: string[];
  dont: string[];
}

export const FIRST_AID: FirstAidGuide[] = [
  {
    id: "bleeding",
    titleKey: "fa.bleeding",
    icon: Droplet,
    urgent: "Call 112 if blood is spurting or will not stop after 10 minutes.",
    steps: [
      "Press firmly on the wound with a clean cloth.",
      "Keep pressing for 10 minutes without lifting to check.",
      "Raise the injured part above the heart if possible.",
      "If blood soaks through, add another cloth on top. Do not remove the first.",
      "Tie a bandage firmly, but not so tight that fingers or toes turn blue.",
    ],
    dont: ["Do not pull out objects stuck in the wound.", "Do not put mud, ash or powder on it."],
  },
  {
    id: "fractures",
    titleKey: "fa.fractures",
    icon: Bone,
    urgent: "Call 112 if bone is showing, or for neck, back or thigh injuries.",
    steps: [
      "Keep the person still. Do not try to straighten the bone.",
      "Support the limb with a splint: a stick, board or rolled newspaper.",
      "Tie the splint above and below the injury with cloth.",
      "Put a cold, wet cloth on the swelling for 20 minutes.",
      "Keep the person warm and calm until help arrives.",
    ],
    dont: ["Do not move someone with a neck or back injury unless they are in danger.", "Do not massage the injury."],
  },
  {
    id: "hypothermia",
    titleKey: "fa.hypothermia",
    icon: Snowflake,
    urgent: "Call 112 if the person is confused, very sleepy or stops shivering.",
    steps: [
      "Move the person out of wind and cold, into shelter.",
      "Remove wet clothes gently and dry the body.",
      "Wrap in blankets, covering the head and neck.",
      "Share body heat if nothing else is available.",
      "Give warm, sweet drinks only if they are awake and can swallow.",
    ],
    dont: ["Do not rub arms and legs.", "Do not give alcohol.", "Do not put them in hot water or near a fire."],
  },
  {
    id: "drowning",
    titleKey: "fa.drowning",
    icon: Waves,
    urgent: "Call 112 at once. Start CPR if the person is not breathing.",
    steps: [
      "Reach or throw a rope, pole or float. Do not jump in unless trained.",
      "Once out, check if they are breathing. Look, listen and feel for 10 seconds.",
      "If not breathing: give 5 rescue breaths, then 30 hard chest pushes and 2 breaths. Repeat.",
      "If breathing: turn them on their side so water can drain.",
      "Keep them warm. Everyone rescued from water must see a doctor.",
    ],
    dont: ["Do not hang the person upside down to drain water.", "Do not stop CPR until help arrives or they breathe."],
  },
];
