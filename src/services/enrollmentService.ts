import { MessageResponse } from "@/interfaces/authResponse";
import {
  CreateEnrollmentPayload,
  EnrollmentResourceResponse,
  ListEnrollmentsParams,
  ListEnrollmentsResponse,
  UpdateEnrollmentPayload,
} from "@/interfaces/enrollment";
import { apiClient } from "@/lib/api-client";
import { buildListQuery } from "@/lib/listQuery";
import {
  enrollmentResponseSchema,
  paginatedSchema,
  parseApiResponse,
  resourceSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function createEnrollment(
  payload: CreateEnrollmentPayload,
): Promise<EnrollmentResourceResponse> {
  const response = await apiClient<EnrollmentResourceResponse>({
    url: "/enrollments",
    method: HttpMethodType.POST,
    body: payload,
    errorMessage: "Erro ao criar matrícula.",
  });

  return parseApiResponse(resourceSchema(enrollmentResponseSchema), response);
}

export async function deleteEnrollment(
  enrollmentId: string,
): Promise<MessageResponse> {
  return apiClient<MessageResponse>({
    url: `/enrollments/${enrollmentId}`,
    method: HttpMethodType.DELETE,
    errorMessage: "Erro ao excluir matrícula.",
  });
}

export async function getEnrollment(
  enrollmentId: string,
): Promise<EnrollmentResourceResponse> {
  const response = await apiClient<EnrollmentResourceResponse>({
    url: `/enrollments/${enrollmentId}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao buscar matrícula.",
  });

  return parseApiResponse(resourceSchema(enrollmentResponseSchema), response);
}

export async function listEnrollments(
  params: ListEnrollmentsParams = {},
): Promise<ListEnrollmentsResponse> {
  const response = await apiClient<ListEnrollmentsResponse>({
    url: `/enrollments${buildListQuery(params)}`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao listar matrículas.",
  });

  return parseApiResponse(paginatedSchema(enrollmentResponseSchema), response);
}

export async function restoreEnrollment(
  enrollmentId: string,
): Promise<EnrollmentResourceResponse> {
  const response = await apiClient<EnrollmentResourceResponse>({
    url: `/enrollments/${enrollmentId}/restore`,
    method: HttpMethodType.POST,
    errorMessage: "Erro ao restaurar matrícula.",
  });

  return parseApiResponse(resourceSchema(enrollmentResponseSchema), response);
}

export async function updateEnrollment(
  enrollmentId: string,
  payload: UpdateEnrollmentPayload,
): Promise<EnrollmentResourceResponse> {
  const response = await apiClient<EnrollmentResourceResponse>({
    url: `/enrollments/${enrollmentId}`,
    method: HttpMethodType.PATCH,
    body: payload,
    errorMessage: "Erro ao atualizar matrícula.",
  });

  return parseApiResponse(resourceSchema(enrollmentResponseSchema), response);
}
