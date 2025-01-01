import { JourneyFormData } from '@/lib/types'

export const createPrompt = (inputs: JourneyFormData) => {
  return `You are a world-class customer experience designer. Design an innovative customer journey for a ${inputs.target_customers} named ${inputs.persona_name} interested in your ${inputs.business_proposition} products and services. ${inputs.persona_name} has ${inputs.customer_scenario}. Write a narrative in 10 steps from awareness of your products and services, the customer using your service, to the customer leaving your service and ongoing customer relationship management. Make sure there are 10 customer journey steps. Display the customer journey steps in a grid with a title and description for each.`
}
