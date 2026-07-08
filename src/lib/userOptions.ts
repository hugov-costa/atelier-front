import { User } from "@/interfaces/user";

export function toStudentOptions(
  users: User[] | undefined,
): { label: string; value: string }[] {
  return (users ?? [])
    .filter((user) => user.role !== "master")
    .map((user) => ({ label: user.name, value: user.id }));
}
