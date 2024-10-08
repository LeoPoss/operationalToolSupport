import { Button } from '@/components/ui/button'
import { PlusCircle } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type React from 'react'
import { toast } from 'sonner'

export const StartProcessInstance = () => {
	const queryClient = useQueryClient()
	const processKey = 'Process_0ll61pn'

	function startProcessInstance() {
		axios
			.post(
				`${process.env.NEXT_PUBLIC_BASE_API}/engine-rest/process-definition/key/${processKey}/start`,
				{ variables: null }
			)
			.then((r) => {
				queryClient.refetchQueries({ queryKey: ['tasks'] })
				toast.success('Started process instance')
			})
			.catch((e) => toast.error(e))
	}

	return (
		<Button className="" onClick={() => startProcessInstance()}>
			<PlusCircle className="mr-2" size={24} weight="duotone" /> Start process
		</Button>
	)
}
