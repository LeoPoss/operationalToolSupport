import type {
	CamundaVariable,
	FormKey,
	FormSchema,
	ProcessInstance,
	Task,
	TaskType,
	Tool,
} from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

function useFetchData<T>(url: string, queryKey: string[], enabled = true) {
	return useQuery({
		queryKey,
		queryFn: async (): Promise<T> => {
			const { data } = await axios.get(
				`${process.env.NEXT_PUBLIC_BASE_API}${url}`
			)
			return data
		},
		enabled,
	})
}

export function useTasks() {
	return useFetchData<Task[]>('/engine-rest/task', ['tasks'])
}

export function useTaskTypes() {
	return useFetchData<TaskType[]>('/tasktype', ['taskTypes'])
}

export function useTools() {
	return useFetchData<Tool[]>('/tools', ['tools'])
}

export function useToolTypes() {
	return useFetchData<Tool[]>('/tools/types', ['toolTypes'])
}

export function useFormSchema(taskId: string) {
	return useFetchData<FormSchema>(
		`/engine-rest/task/${taskId}/deployed-form`,
		['formSchema', taskId],
		!!taskId
	)
}

export function useFormKey(taskId: string) {
	return useFetchData<FormKey>(
		`/engine-rest/task/${taskId}/form`,
		['formKey', taskId],
		!!taskId
	)
}

export function useTaskTypeVariable(taskId: string) {
	return useFetchData<CamundaVariable>(
		`/engine-rest/task/${taskId}/variables/taskType`,
		['taskTypeVariable', taskId],
		!!taskId
	)
}

export function useProcessInstances() {
	return useFetchData<ProcessInstance[]>('/engine-rest/process-instance', [
		'processInstances',
	])
}
