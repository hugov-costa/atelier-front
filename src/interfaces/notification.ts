import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { ListParams } from "@/lib/listQuery";
import { notificationResponseSchema } from "@/lib/responseSchemas";

export type Notification = z.infer<typeof notificationResponseSchema>;

export type ListNotificationsResponse = PaginatedResponse<Notification>;

export type NotificationResourceResponse = ResourceResponse<Notification>;

export type ListNotificationsParams = Pick<ListParams, "page" | "perPage"> & {
  unread?: boolean;
};
