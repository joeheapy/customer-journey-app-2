export interface JourneyFormData {
  target_customers: string
  persona_name: string
  business_proposition: string
  customer_scenario: string
}

export interface JourneyStep {
  step: number
  title: string
  description: string
  responseTitle: string
}

export interface CustomerPainPointData {
  step: number
  title: string
  description: string
}
