### Shadcn-ui date picker

My version of a date picker for shadcn-ui

## How to use

```tsx
export default function App() {
	const [date, setDate] = useState<Date | undefined>()
	return (
		<main>
			<DatePicker
				selectedDate={date}
				setSelectedDate={setDate}
			/>
		</main>
	)
}
```

or inside a form :

```tsx
type Values = {
	// your form return data type
}

export const MyDateForm = () => {
	const form = useForm()

	const handleSubmit = (e: Values) => {
		console.log(e)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<FormField
					name={props.name as Path<T>}
					control={props.control}
					shouldUnregister
					render={(field) => {
						return (
							<FormItem>
								<DatePicker
									ref={field.ref}
									setSelectedDate={field.onChange}
									selectedDate={field.value}
									disabled={field.disabled}
									id={id ?? (field.name as string)}
									isForm={true} // IMPORTANT
									// other props can be passed like
									// disabledBefore or disabledAfter
								/>
								<FormMessage />
							</FormItem>
						)
					}}
				/>
			</form>
		</Form>
	)
}
```
