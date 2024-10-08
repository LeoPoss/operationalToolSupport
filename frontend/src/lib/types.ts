export type Tool = {
	externalId: string
	brand: string
	name: string
	model: string
	type: string
	description: string
	status: 'IN_USE' | 'AVAILABLE' | 'IN_REPAIR'
}

export type FormSchema = {
	components: Component[]
}

export type TaskType = {
	id: string
	name: string
	toolIds: string[]
	toolTypes: string[]
}

export type FormKey = {
	key?: string
	camundaFormRef?: {
		key: string
		binding: string
		version?: string
	}
}

export type CamundaVariable = {
	type: string
	value: string
}

export type Component = {
	id: string
	key: string
	label: string
	layout: any
	searchable: boolean
	type: 'select' | 'button' | any
	values: SelectValue[]
	action?: 'button' | 'reset' | 'submit' | undefined
	validate?: { required: boolean }
}

export type SelectValue = {
	label: string
	value: string
}

export type Task = {
	id: string
	name: string
	assignee?: string
	created: Date
	due: Date
	followUp: Date
	lastUpdated: Date
	delegationState: string | null
	description: string | null
	executionId: string
	owner: string | null
	parentTaskId: string | null
	priority: 0 | 50 | 100
	processDefinitionId: string
	processInstanceId: string
	taskDefinitionKey: string
	caseExecutionId: string | null
	caseInstanceId: string | null
	caseDefinitionId: string | null
	suspended: boolean
	formKey: string | null
	camundaFormRef: string | null
	tenantId: string
}

export type ProcessInstance = {
	id: string
	definitionId: string
	businessKey: string
}
