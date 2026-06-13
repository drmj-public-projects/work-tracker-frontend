export interface ApiResponse<T> {
  status: number
  errorCode?: string
  message: string
  data: T
}
