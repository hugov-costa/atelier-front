import { describe, expect, it } from "vitest";

import { User } from "@/interfaces/user";
import { can, canViewUsers, isMaster } from "@/lib/authorization";

const master: User = {
  id: "1",
  name: "Master",
  email: "master@example.com",
  role: "master",
};
const admin: User = {
  id: "2",
  name: "Admin",
  email: "admin@example.com",
  role: "admin",
};
const regular: User = {
  id: "3",
  name: "Regular",
  email: "user@example.com",
  role: "user",
};

describe("can", () => {
  it("denies every permission for anonymous users", () => {
    expect(can(null, "users.view")).toBe(false);
    expect(can(null, "users.manage")).toBe(false);
    expect(can(null, "audits.view")).toBe(false);
  });

  it("grants every permission to masters", () => {
    expect(can(master, "users.view")).toBe(true);
    expect(can(master, "users.manage")).toBe(true);
    expect(can(master, "audits.view")).toBe(true);
  });

  it("lets admins read but not manage other users", () => {
    expect(can(admin, "users.view")).toBe(true);
    expect(can(admin, "audits.view")).toBe(true);
    expect(can(admin, "users.manage")).toBe(false);
  });

  it("grants back-office abilities to staff (admin and master)", () => {
    expect(can(admin, "atelier.manage")).toBe(true);
    expect(can(admin, "reports.view")).toBe(true);
    expect(can(master, "atelier.manage")).toBe(true);
    expect(can(master, "reports.view")).toBe(true);
  });

  it("denies elevated permissions to regular users", () => {
    expect(can(regular, "atelier.manage")).toBe(false);
    expect(can(regular, "audits.view")).toBe(false);
    expect(can(regular, "reports.view")).toBe(false);
    expect(can(regular, "users.manage")).toBe(false);
    expect(can(regular, "users.view")).toBe(false);
  });
});

describe("isMaster", () => {
  it("is true only for the master role", () => {
    expect(isMaster(master)).toBe(true);
    expect(isMaster(admin)).toBe(false);
    expect(isMaster(regular)).toBe(false);
    expect(isMaster(null)).toBe(false);
  });
});

describe("canViewUsers", () => {
  it("is true for admins and masters only", () => {
    expect(canViewUsers(master)).toBe(true);
    expect(canViewUsers(admin)).toBe(true);
    expect(canViewUsers(regular)).toBe(false);
    expect(canViewUsers(null)).toBe(false);
  });
});
