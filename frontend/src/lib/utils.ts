import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const transformToNestedJSON = (
	original: { [s: string]: string } | ArrayLike<string>
) => {
	return {
		variables: Object.fromEntries(
			Object.entries(original).map(([key, value]) => [key, { value }])
		),
	}
}

export function rg(input: string): string {
	let output = input.replace(/ae/g, 'ä')
	output = output.replace(/oe/g, 'ö')
	output = output.replace(/ue/g, 'ü')

	return output
}
