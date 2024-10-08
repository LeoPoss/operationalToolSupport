import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormLabel } from '@/components/ui/form'
import { MultiSelect } from '@/components/ui/multi-select'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useProcessInstances, useTools } from '@/lib/actions'
import type { Tool } from '@/lib/types'
import { SignOut } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const InjectLeaveCompany = () => {
	const queryClient = useQueryClient()
	const { data: processInstances } = useProcessInstances()
	const { data: tools } = useTools()

	const form = useForm({
		defaultValues: {
			processInstanceId: '',
		},
	})

	const toolsList = tools?.map((t: Tool) => ({
		value: t.externalId,
		label: `${t.externalId} (${t.brand} ${t.model})`,
		brand: t.brand,
		status: t.status,
	}))

	const [selectedCurrentTools, setSelectedCurrentTools] = useState<string[]>([])

	function onSubmit(data: any) {
		const messageName = 'LeaveCompanyPremise'
		const body = {
			messageName,
			processVariables: {
				currentTools: {
					value: JSON.stringify(selectedCurrentTools),
					type: 'object',
					valueInfo: {
						objectTypeName: 'java.util.ArrayList',
						serializationDataFormat: 'application/json',
					},
				},
			},
			...data,
		}
		axios
			.post(`${process.env.NEXT_PUBLIC_BASE_API}/engine-rest/message`, body)
			.then((r) => {
				toast.success('Left company')
				queryClient.refetchQueries()
			})
	}

	return (
		<div className="rounded-xl col-span-2 border shadow-xl p-4  bg-gradient-to-br from-red-200 to-40%">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col space-y-2"
				>
					<FormField
						control={form.control}
						name="processInstanceId"
						render={({ field }) => (
							<Select
								onValueChange={field.onChange}
								value={field.value}
								onOpenChange={() =>
									queryClient.refetchQueries({
										queryKey: ['processInstances'],
									})
								}
							>
								<FormLabel>Process Instance</FormLabel>
								<FormControl>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{processInstances?.length === 0 && (
										<SelectItem disabled value={'_'}>
											No process running!
										</SelectItem>
									)}
									{processInstances?.map((val) => (
										<SelectItem key={val.id} value={val.id}>
											{val.id}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
					{toolsList && (
						<div>
							<FormLabel>Tool at hand</FormLabel>
							<MultiSelect
								options={toolsList.filter((t) => t.status === 'AVAILABLE')}
								onValueChange={setSelectedCurrentTools}
								value={selectedCurrentTools}
								variant="inverted"
							/>
						</div>
					)}
					<div className="text-sm text-muted-foreground">
						We always know which tool, so we do not have to allow the selection
						of a "random" tool of type x
					</div>
					<Button type="submit">
						<SignOut className="mr-2" size={24} weight="duotone" />
						Inject Leave Company
					</Button>
				</form>
			</Form>
		</div>
	)
}
