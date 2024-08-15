import { Button, type ButtonProps } from "./ui/button";
import { Loader2 } from "~/lib/icons/Loader2";
import { Text } from "./ui/text";
import { cn } from "~/lib/utils";
import type { ReactNode } from "react";

interface FormSubmitButtonProps extends ButtonProps {
	children: ReactNode;
	isPending: boolean;
}

export default function FormSubmitButton({
	isPending,
	children,
	...props
}: FormSubmitButtonProps) {
	return (
		<Button
			className={cn("relative", props.className)}
			disabled={isPending}
			{...props}
		>
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
