/**
 * @fileoverview Example responses from microservices.
 * These responses are copied directly from their respective docs.
 */

export const verifyUserSuccessResponse = {
  status: 200,
  data: {
    id: "1",
    email: "user@example.com",
    name: "John Doe",
  },
};

export const verifyUserInvalidResponse = {
  status: 401,
  data: {
    detail: "Invalid token.",
  },
};

export const projectInfoSuccessResponse = {
  status: 200,
  data: {
    id: 0,
    title: "Some Project",
    owner: 0,
    company: "Example Company",
    users: [],
    live_site: "https://example.com",
    staging_site: "https://staging.example.com",
    created_at: "2023-12-09T23:01:17.288Z",
    links: [],
  },
};

export const projectInfoNotFoundResponse = {
  status: 404,
  data: {
    detail: "Not found.",
  },
};
