import { Button, type ButtonProps } from "./ui/button";
import { Text } from "./ui/text";
import type { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";

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
        <Text>{isPending ? <ActivityIndicator /> : children}</Text>
      </View>
    </Button>
  );
}
