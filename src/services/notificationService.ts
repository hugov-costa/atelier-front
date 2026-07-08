import { MessageResponse } from "@/interfaces/authResponse";
import {
  ListNotificationsParams,
  ListNotificationsResponse,
  NotificationResourceResponse,
} from "@/interfaces/notification";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  notificationResponseSchema,
  paginatedSchema,
  parseApiResponse,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function listNotifications(
  params: ListNotificationsParams = {},
): Promise<ListNotificationsResponse> {
  const response = await apiClient<ListNotificationsResponse>({
    url: `/notifications${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar notificações.",
  });

  return parseApiResponse(
    paginatedSchema(notificationResponseSchema),
    response,
  );
}

export async function markAllNotificationsRead(): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: "/notifications/read-all",
    method: HttpMethodType.POST,
    errorMessage: "Erro ao marcar as notificações como lidas.",
  });
}

export async function markNotificationRead(
  notificationId: string,
): Promise<NotificationResourceResponse> {
  const response = await apiClient<NotificationResourceResponse>({
    url: `/notifications/${notificationId}/read`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao marcar a notificação como lida.",
  });

  return parseApiResponse(resourceSchema(notificationResponseSchema), response);
}
