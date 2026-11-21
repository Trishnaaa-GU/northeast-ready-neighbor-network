export interface KitGroup {
  id: string;
  title: string;
  items: { id: string; label: string }[];
}

export const KIT_GROUPS: KitGroup[] = [
  {
    id: "water-food",
    title: "Water & food",
    items: [
      { id: "water", label: "Drinking water — 3 litres per person per day, for 3 days" },
      { id: "food", label: "Dry food: chira, biscuits, jaggery, roasted chana" },
      { id: "tablets", label: "Water purifying tablets" },
    ],
  },
  {
    id: "health",
    title: "Health",
    items: [
      { id: "firstaid", label: "First aid box: bandages, antiseptic, ORS" },
      { id: "medicines", label: "Medicines you take daily, for 7 days" },
      { id: "masks", label: "Masks, soap and sanitary pads" },
    ],
  },
  {
    id: "light-power",
    title: "Light & power",
    items: [
      { id: "torch", label: "Torch with extra batteries" },
      { id: "powerbank", label: "Charged power bank and charging cable" },
      { id: "radio", label: "Battery or wind-up radio" },
      { id: "whistle", label: "Whistle to signal for help" },
    ],
  },
  {
    id: "warmth",
    title: "Warmth (for hills)",
    items: [
      { id: "blanket", label: "Blanket or emergency foil blanket" },
      { id: "clothes", label: "Warm clothes, cap and gloves" },
      { id: "raincoat", label: "Raincoat and strong shoes" },
    ],
  },
  {
    id: "documents",
    title: "Documents & money",
    items: [
      { id: "ids", label: "Aadhaar, ration card, bank passbook in a plastic bag" },
      { id: "cash", label: "Some cash in small notes" },
      { id: "contacts", label: "Written list of family phone numbers" },
    ],
  },
];
