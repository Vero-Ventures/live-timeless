import { Button, type ButtonProps } from "./ui/button";
import { Loader2 } from "~/lib/icons/Loader2";
import { Text } from "./ui/text";
import { cn } from "~/lib/utils";
import type { ReactNode } from "react";
import { View } from "react-native";

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
		<Button className={props.className} disabled={isPending} {...props}>
			<View>
				<Text>
					{isPending ? (
						<Loader2 className="animate-spin text-foreground" />
					) : (
						children
					)}
				</Text>
			</View>
		</Button>
	);
}
