"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { breadcrumbSegmentKeys } from "@/config/navigation";

interface Crumb {
  label: string;
  href: string;
}

function isLikelyId(segment: string): boolean {
  return /^[0-9A-Za-z]{10,}$/.test(segment) && !breadcrumbSegmentKeys[segment];
}

export function Breadcrumbs() {
  const t = useTranslations("breadcrumb");
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ label: t("home"), href: "/" }];

  let accumulatedPath = "";
  for (const segment of segments) {
    accumulatedPath += `/${segment}`;
    const key = breadcrumbSegmentKeys[segment];
    const label = isLikelyId(segment) ? t("details") : key ? t(key) : segment;
    crumbs.push({ label, href: accumulatedPath });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <Fragment key={crumb.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {isLast ? null : <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
