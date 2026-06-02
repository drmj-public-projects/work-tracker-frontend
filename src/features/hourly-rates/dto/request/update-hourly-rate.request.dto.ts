export interface UpdateHourlyRateRequestDTO {
  rate: number
  validFrom: string
  validTo: string | null
}
