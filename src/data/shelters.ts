import type { NEState } from "./alerts";

export interface Shelter {
  id: string;
  state: NEState;
  district: string;
  name: string;
  place: string;
  capacity: number;
  occupied: number;
  facilities: ("water" | "medical" | "power" | "food" | "blankets")[];
}

export const SHELTERS: Shelter[] = [
  { id: "as-1", state: "Assam", district: "Kamrup Metro", name: "Govt. Higher Secondary School", place: "Maligaon, Guwahati", capacity: 400, occupied: 120, facilities: ["water", "medical", "power", "food"] },
  { id: "as-2", state: "Assam", district: "Dhemaji", name: "Silapathar Town Hall", place: "Silapathar", capacity: 350, occupied: 310, facilities: ["water", "food", "blankets"] },
  { id: "as-3", state: "Assam", district: "Lakhimpur", name: "Raised Platform Relief Camp", place: "Dhakuakhana", capacity: 250, occupied: 90, facilities: ["water", "food", "medical"] },
  { id: "as-4", state: "Assam", district: "Dima Hasao", name: "Haflong Govt. College Hall", place: "Haflong", capacity: 200, occupied: 45, facilities: ["water", "power", "blankets"] },
  { id: "ar-1", state: "Arunachal Pradesh", district: "Tawang", name: "Community Hall", place: "Tawang Town", capacity: 180, occupied: 60, facilities: ["water", "power", "blankets", "food"] },
  { id: "ar-2", state: "Arunachal Pradesh", district: "West Kameng", name: "Govt. Secondary School", place: "Dirang", capacity: 150, occupied: 30, facilities: ["water", "blankets", "medical"] },
  { id: "ar-3", state: "Arunachal Pradesh", district: "Papum Pare", name: "Indira Gandhi Park Relief Centre", place: "Itanagar", capacity: 300, occupied: 0, facilities: ["water", "power", "medical", "food"] },
  { id: "ar-4", state: "Arunachal Pradesh", district: "Shi Yomi", name: "Circle Office Hall", place: "Mechuka", capacity: 80, occupied: 12, facilities: ["water", "blankets"] },
  { id: "nl-1", state: "Nagaland", district: "Kohima", name: "Local Ground Community Hall", place: "Kohima", capacity: 250, occupied: 40, facilities: ["water", "power", "food"] },
  { id: "nl-2", state: "Nagaland", district: "Mokokchung", name: "Town Baptist Church Hall", place: "Mokokchung", capacity: 200, occupied: 15, facilities: ["water", "blankets", "food"] },
  { id: "nl-3", state: "Nagaland", district: "Chümoukedima", name: "Govt. Higher Secondary School", place: "Chümoukedima", capacity: 220, occupied: 70, facilities: ["water", "medical", "power"] },
  { id: "ml-1", state: "Meghalaya", district: "East Khasi Hills", name: "Sohra Community Centre", place: "Sohra", capacity: 160, occupied: 20, facilities: ["water", "power", "blankets"] },
  { id: "mn-1", state: "Manipur", district: "Ukhrul", name: "Ukhrul District Hospital Annexe", place: "Ukhrul", capacity: 120, occupied: 55, facilities: ["water", "medical", "power"] },
  { id: "mz-1", state: "Mizoram", district: "Aizawl", name: "YMA Hall", place: "Ramhlun North, Aizawl", capacity: 150, occupied: 35, facilities: ["water", "food", "blankets"] },
  { id: "tr-1", state: "Tripura", district: "West Tripura", name: "Umakanta Academy", place: "Agartala", capacity: 300, occupied: 0, facilities: ["water", "power", "food"] },
  { id: "sk-1", state: "Sikkim", district: "Mangan", name: "Senior Secondary School", place: "Mangan", capacity: 180, occupied: 140, facilities: ["water", "medical", "blankets", "food"] },
  { id: "sk-2", state: "Sikkim", district: "Gangtok", name: "Paljor Stadium Relief Camp", place: "Gangtok", capacity: 500, occupied: 80, facilities: ["water", "power", "medical", "food"] },
];
