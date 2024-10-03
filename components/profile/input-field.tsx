import React from "react";
import { View, TextInputProps } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";

type InputFieldProps = {
    label?: string;
    value?: string;
    setValue: (value: string) => void;
    placeholder?: string;
    height?: number;
} & TextInputProps;

const InputField: React.FC<InputFieldProps> = ({
    label,
    value,
    setValue,
    placeholder,
    height=56
}) => (
    <View style={{ marginVertical: 8 }}>
    {label && <Text style={{ color: "#a6b1c3", marginBottom: 3, fontSize: 16 }}>{label}</Text>}
    <Input
        style={{
        height: height,
        flex: 1,
        borderRadius: 10,
        borderWidth: 0,
        backgroundColor: "#0e2942",
        padding: 16,
        color: "#ffffff",
        }}
        placeholder={placeholder}
        placeholderTextColor="#a6b1c3"
        value={value}
    onChangeText={setValue}
    />
    </View>
);


export default InputField;
