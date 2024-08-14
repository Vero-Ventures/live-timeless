import { Button } from "./ui/button";
import { Loader2 } from "~/lib/icons/Loader2";
import type { ComponentProps, ReactNode } from "react";
import { Text } from "./ui/text";

interface FormSubmitButtonProps extends ComponentProps<typeof Button> {
	children: ReactNode;
	isPending: boolean;
}

export default function FormSubmitButton({
	isPending,
	children,
	...props
}: FormSubmitButtonProps) {
	return (
		<Button className="relative" disabled={isPending} {...props}>
			{!isPending ? (
				<Text>{children}</Text>
			) : (
				<Text className="animate-spin">
					<Loader2 />
				</Text>
			)}
		</Button>
	);
}
