import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	useFormKey,
	useFormSchema,
	useTaskTypeVariable,
	useTaskTypes,
	useTools,
} from '@/lib/actions'
import type { Task } from '@/lib/types'
import { transformToNestedJSON } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { formatDistance } from 'date-fns'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const TaskDetail = ({
	task,
	setSelectedItem,
}: { task: Task; setSelectedItem: (item: string | null) => void }) => {
	const form = useForm()
	const { data: formSchema } = useFormSchema(task.id)
	const { data: formKey } = useFormKey(task.id)
	const { data: taskTypes } = useTaskTypes()
	const { data: taskTypeVariable } = useTaskTypeVariable(task.id)
	const { data: tools } = useTools()

	const queryClient = useQueryClient()

	function onSubmit(data: { [x: string]: string; taskId: string }) {
		const { taskId, ...variables } = data
		axios
			.post(
				`${process.env.NEXT_PUBLIC_BASE_API}/engine-rest/task/${taskId}/submit-form`,
				transformToNestedJSON(variables)
			)
			.then(() => {
				toast.error(`Finished Task ${task.name}`, {
					description: JSON.stringify(variables),
				})
				queryClient.refetchQueries()
				setSelectedItem(null)
			})
			.catch((e) => {
				toast.error(e)
			})
	}

	const renderToolList = () => {
		return taskTypes
			?.filter((t) => t.name === taskTypeVariable?.value)
			.flatMap((t) =>
				t.toolIds
					.map((toolId) => tools?.find((tool) => tool.externalId === toolId))
					.filter(Boolean)
			)
			.map((tool) => (
				<li key={tool?.externalId}>
					{tool?.brand} {tool?.model}
				</li>
			))
	}

	const renderToolTypes = () => {
		console.log(taskTypeVariable)
		return taskTypes
			?.filter((t) => t.name === taskTypeVariable?.value)[0]
			.toolTypes.map((toolType) => (
				<li key={toolType}>Any {toolType}</li>
			))
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>{task.name}</CardTitle>

					<span className="text-sm text-muted-foreground">
						{formatDistance(task.created, new Date(), {
							addSuffix: true,
						})}
					</span>
				</CardHeader>
				{formKey?.key === 'searchTool' ? (
					<CardContent>
						<span>You gonna need the following tools:</span>
						{taskTypes && tools && (
							<ul className="list-disc ml-8">
								{renderToolList()}
								{renderToolTypes()}
							</ul>
						)}
					</CardContent>
				) : (
					<></>
				)}
				{formSchema ? (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<CardContent>
								<FormField
									control={form.control}
									name="taskId"
									defaultValue={task.id}
									render={() => <></>}
								/>
								{formSchema?.components
									.filter((c) => c.type !== 'button')
									.map((c) => {
										switch (c.type) {
											case 'select': {
												return (
													<>
														<FormField
															control={form.control}
															name={c.key}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>{c.label}</FormLabel>
																	<Select
																		onValueChange={field.onChange}
																		defaultValue={field.value}
																		required={c.validate?.required}
																	>
																		<FormControl>
																			<SelectTrigger>
																				<SelectValue placeholder="Select task type" />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			{c.values.map((val) => (
																				<SelectItem
																					key={val.value}
																					value={val.value}
																				>
																					{val.label}
																				</SelectItem>
																			))}
																		</SelectContent>
																	</Select>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</>
												)
											}
											case 'input': {
												return (
													<FormField
														control={form.control}
														name="username"
														render={({ field }) => (
															<FormItem>
																<FormLabel>T</FormLabel>
																<FormControl>
																	<Input placeholder="shadcn" {...field} />
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												)
											}
											default: {
												return <>Missing {c.type}</>
											}
										}
									})}
							</CardContent>
							<CardFooter>
								{formSchema?.components
									.filter((c) => c.type === 'button')
									.map((button) => (
										<Button type={button.action} key={button.action}>
											{button.label}
										</Button>
									))}
								<Button type="submit">Finish task</Button>
							</CardFooter>
						</form>
					</Form>
				) : (
					<>
						<CardContent>
							<span className="text-muted-foreground text-sm">No form</span>
						</CardContent>
						<CardFooter>
							<Button
								type="submit"
								onClick={() => onSubmit({ taskId: task.id })}
							>
								Finish task
							</Button>
						</CardFooter>
					</>
				)}
			</Card>
		</>
	)
}
