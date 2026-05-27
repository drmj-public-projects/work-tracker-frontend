export const UserOrganizationRole = {
  EMPLOYEE: 'EMPLOYEE',
  EMPLOYER: 'EMPLOYER',
  ADMIN: 'ADMIN',
} as const

export type UserOrganizationRole =
  (typeof UserOrganizationRole)[keyof typeof UserOrganizationRole]
