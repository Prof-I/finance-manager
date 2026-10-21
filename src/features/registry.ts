import type { ComponentType } from "react";
import { Expenses } from "./expenses/Expenses.tsx";
import { Loans } from "./loans/Loans.tsx";
import { Profile } from "./profile/Profile.tsx";
import { Summary } from "./summary/Summary.tsx";

export interface FeatureDef {
  id: string;
  title: string;
  component: ComponentType;
}

/**
 * To add a feature: create src/features/<name>/<Name>.tsx and add one entry here.
 * It appears in the navigation automatically.
 */
export const features: FeatureDef[] = [
  { id: "summary", title: "Summary", component: Summary },
  { id: "income", title: "Income", component: Profile },
  { id: "expenses", title: "Expenses", component: Expenses },
  { id: "loans", title: "Loans", component: Loans },
];
