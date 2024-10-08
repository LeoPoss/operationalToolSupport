import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/ui/multi-select'
import { useToolTypes, useTools } from '@/lib/actions'
import type { TaskType, Tool } from '@/lib/types'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const TaskToTool = ({ taskType }: { taskType: TaskType }) => {
	const { data: tools } = useTools()
	const { data: toolTypes } = useToolTypes()
	const [selectedTools, setSelectedTools] = useState<string[]>(taskType.toolIds)
	const [selectedToolTypes, setSelectedToolTypes] = useState<string[]>(
		taskType.toolTypes
	)

	const toolsList = tools?.map((t: Tool) => ({
		value: t.externalId,
		label: `${t.externalId} (${t.brand} ${t.model})`,
		icon: undefined,
		brand: t.brand,
	}))

	const typesList = toolTypes?.map((t: string) => ({
		value: t,
		label: t,
		icon: undefined,
		brand: undefined,
	}))

	const form = useForm()

	useEffect(() => {
		saveTools()
	}, [selectedTools, selectedToolTypes])

	function saveTools() {
		console.log(selectedToolTypes)
		console.log(selectedTools)
		axios
			.post(
				`${process.env.NEXT_PUBLIC_BASE_API}/tasktype/${taskType.id}/tools`,
				selectedTools
			)
			.catch((e) => {
				toast.error(e)
			})
		axios
			.post(
				`${process.env.NEXT_PUBLIC_BASE_API}/tasktype/${taskType.id}/toolTypes`,
				selectedToolTypes
			)
			.catch((e) => {
				toast.error(e)
			})
	}

	return (
		<div className="p-4 max-w-xl">
			<div className="flex flex-col space-y-2">
				<span className="font-medium">{taskType.name}</span>
				<Form {...form}>
					<form className="grid grid-cols-2 space-x-4">
						<div>
							{toolsList && (
								<>
									<Label>Needed tool(s)</Label>
									<MultiSelect
										options={toolsList}
										onValueChange={setSelectedTools}
										defaultValue={selectedTools}
										placeholder="Needed tools"
										variant="inverted"
									/>
								</>
							)}
						</div>
						<div>
							{toolsList && (
								<>
									<Label>Needed tooltype(s)</Label>
									<MultiSelect
										options={typesList}
										onValueChange={setSelectedToolTypes}
										defaultValue={selectedToolTypes}
										placeholder="Needed tool types"
										variant="inverted"
									/>
								</>
							)}
						</div>
					</form>
				</Form>
			</div>
		</div>
	)
}
