import { View } from "react-native";
import { Input } from "./ui/input";
import { Search } from "~/lib/icons/Search";
import { router } from "expo-router";
import { useState } from "react";

export default function SearchInput({ query }: { query?: string }) {
  const [search, setSearch] = useState(query);
  return (
    <View className="mb-6 gap-2">
      <View className="relative">
        <Input
          className="native:h-16 rounded-xl pr-10"
          value={search}
          placeholder="Search..."
          placeholderTextColor="#CDCDE0"
          returnKeyType="search"
          onChangeText={(search) => {
            setSearch(search);
            router.setParams({ query: search });
          }}
        />
        <Search className="absolute right-4 top-[16px] text-foreground" />
      </View>
    </View>
  );
}
