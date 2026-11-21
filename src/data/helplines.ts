import type { NEState } from "./alerts";

export interface Helpline {
  number: string;
  name: string;
  note: string;
}

export const NATIONAL_HELPLINES: Helpline[] = [
  { number: "112", name: "National Emergency", note: "Police, fire, ambulance — one number" },
  { number: "108", name: "Ambulance", note: "Medical emergency" },
  { number: "1078", name: "NDMA Disaster Helpline", note: "National disaster control room" },
  { number: "100", name: "Police", note: "Crime and law & order" },
  { number: "101", name: "Fire", note: "Fire and rescue" },
  { number: "1077", name: "District Control Room", note: "Your district's disaster office" },
  { number: "1091", name: "Women Helpline", note: "Safety and support for women" },
  { number: "1098", name: "Childline", note: "Help for children in danger" },
];

/** Most states use 1070 for the State Emergency Operations Centre; numbers must be confirmed locally. */
export const STATE_CONTROL_ROOMS: { state: NEState; office: string; number: string }[] = [
  { state: "Assam", office: "ASDMA State Emergency Operations Centre, Guwahati", number: "1070" },
  { state: "Arunachal Pradesh", office: "State Emergency Operations Centre, Itanagar", number: "1070" },
  { state: "Nagaland", office: "NSDMA State Emergency Operations Centre, Kohima", number: "1070" },
  { state: "Meghalaya", office: "MSDMA State Emergency Operations Centre, Shillong", number: "1070" },
  { state: "Manipur", office: "State Emergency Operations Centre, Imphal", number: "1070" },
  { state: "Mizoram", office: "State Emergency Operations Centre, Aizawl", number: "1070" },
  { state: "Tripura", office: "State Emergency Operations Centre, Agartala", number: "1070" },
  { state: "Sikkim", office: "SSDMA State Emergency Operations Centre, Gangtok", number: "1070" },
];
