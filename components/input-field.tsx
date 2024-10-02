import React from "react";
import { View, StyleSheet, TextInputProps } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";

// Defining types for the component props
type InputFieldProps = {
    label?: string;
    value?: string; //maybe not nullable?
    setValue?: (value: string) => null; //maybe void?
    placeholder?: string; //maybe nullable?
} & TextInputProps;

// InputField component
const InputField: React.FC<InputFieldProps> = ({
    label,
    value,
    setValue,
    placeholder,
}) => (
    <View style={{ marginVertical: 8 }}>
    {label && <Text style={{ color: "#a6b1c3", marginBottom: 4, fontSize: 16 }}>{label}</Text>}
    <Input
        style={{
        height: 56,
        flex: 1,
        borderRadius: 12,
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
