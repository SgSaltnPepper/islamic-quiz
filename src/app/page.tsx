import { redirect } from "next/navigation";

// This file only exists to catch the root URL and send users to the English homepage
export default function RootPage() {
  redirect("/en"); 
}