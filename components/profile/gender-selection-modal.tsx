import React from "react";
import { View, Modal, TouchableOpacity, Text, FlatList } from "react-native";

type GenderOption = {
label: string;
value: string;
};

type GenderSelectionModalProps = {
visible: boolean;
options: GenderOption[];
selectedValue: string;
onSelect: (value: string) => void;
onClose: () => void;
};

const GenderSelectionModal: React.FC<GenderSelectionModalProps> = ({
visible,
options,
selectedValue,
onSelect,
onClose,
}) => {
return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
    >
    <View
        style={{
flex: 1,
justifyContent: "center",
alignItems: "center",
backgroundColor: "rgba(0,0,0,0.5)",
}}
>
<View
style={{
width: "80%",
backgroundColor: "#0e2942",
borderRadius: 8,
padding: 16,
alignItems: "center",
}}
>
<Text
style={{
color: "#ffffff",
fontSize: 18,
marginBottom: 16,
textAlign: "center",
fontWeight: "bold",
}}
>
Select Gender
</Text>
<FlatList
data={options}
keyExtractor={(item) => item.value}
renderItem={({ item }) => (
<TouchableOpacity
onPress={() => {
    onSelect(item.value);
    onClose();
}}
style={{
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth:
    item.value === options[options.length - 1].value ? 0 : 1,
    borderBottomColor: "#a6b1c3",
}}
>
<Text
    style={{
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    }}
>
    {item.label}
</Text>
</TouchableOpacity>
)}
/>
<TouchableOpacity onPress={onClose}>
<Text
    style={{
    color: "#ffffff",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
    }}
>
    Cancel
</Text>
</TouchableOpacity>
</View>
</View>
</Modal>
);
};

export default GenderSelectionModal;
