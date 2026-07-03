export enum HttpMethodType {
  DELETE = "DELETE",
  GET = "GET",
  PATCH = "PATCH",
  POST = "POST",
  PUT = "PUT",
}

export const mutatingHttpMethods: ReadonlyArray<HttpMethodType> = [
  HttpMethodType.DELETE,
  HttpMethodType.PATCH,
  HttpMethodType.POST,
  HttpMethodType.PUT,
];

export function isMutatingHttpMethod(method: HttpMethodType): boolean {
  return mutatingHttpMethods.includes(method);
}
