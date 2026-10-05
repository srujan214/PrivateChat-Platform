import { USER_A, USER_B } from "./constants";

export function getPartnerUsername(myUsername?: string): string {
  if (!myUsername) return USER_B;
  if (myUsername === USER_A) return USER_B;
  if (myUsername === USER_B) return USER_A;
  return USER_B;
}