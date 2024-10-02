import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "~/convex/_generated/api";

type UserProfile = {
_id: string;
name?: string;
email?: string;
dob?: string;
gender?: string;  
height?: number;
weight?: number;
};


export const useEditProfile = () => {
const router = useRouter();
const user = useQuery(api.users.currentUser);
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [dobDay, setDobDay] = useState("");
const [dobMonth, setDobMonth] = useState("");
const [dobYear, setDobYear] = useState("");
const [gender, setGender] = useState("");
const [height, setHeight] = useState("");
const [weight, setWeight] = useState("");

const [open, setOpen] = useState(false);
const [genderOptions] = useState([
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Unspecified", value: "Unspecified" },
]);

const updateUserProfileMutation = useMutation(api.users.updateUserProfile);

useEffect(() => {
    if (user) {
    const [year, month, day] = (user.dob ?? "").split("-");
    setDobYear(year || "");
    setDobMonth(month || "");
    setDobDay(day || "");
    setName(user.name || "");
    setEmail(user.email || "");
    setGender(user.gender || "");
    setHeight(user.height ? user.height.toString() : "");
    setWeight(user.weight ? user.weight.toString() : "");
    }
}, [user]);

const handleUpdateProfile = async () => {
    if (user) {
    const dob = `${dobYear}-${dobMonth}-${dobDay}`;

      // Call the mutation with the updated user data
    await updateUserProfileMutation({
        id: user._id,
        name,
        email,
        dob,
        gender,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
    });
    router.push("/profile");

      //TODO: add notification for successful update
}
};

return {
    name,
    setName,
    email,
    setEmail,
    dobDay,
    setDobDay,
    dobMonth,
    setDobMonth,
    dobYear,
    setDobYear,
    gender,
    setGender,
    height,
    setHeight,
    weight,
    setWeight,
    open,
    setOpen,
    genderOptions,
    handleUpdateProfile,
};
};
