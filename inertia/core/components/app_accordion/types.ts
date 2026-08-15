export type AccordionGroup = {
  id: string
  title: string
  descripton?: string
  children?: AccordionGroup[]
}

export type Accordion = {
  type: 'checkbox' | 'input'
  groups: AccordionGroup[]
  disabled?: boolean
  selected: string[] | number[]
}
