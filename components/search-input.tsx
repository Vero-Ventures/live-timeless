import { Alert, Pressable, View } from "react-native";
import { Input } from "./ui/input";
import { Search } from "~/lib/icons/Search";
import { router, usePathname } from "expo-router";
import { useState } from "react";

export default function SearchInput({
  initialQuery,
}: {
  initialQuery?: string;
}) {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="mb-6 gap-2">
      <View className="relative">
        <Input
          className="native:h-16 rounded-xl pr-10"
          value={query}
          placeholder="Search..."
          placeholderTextColor="#CDCDE0"
          onChangeText={(e) => setQuery(e)}
        />
        <Pressable
          className="absolute right-4 top-[16px]"
          onPress={() => {
            if (!query) {
              return Alert.alert(
                "Missing query",
                "Please input something to search results across database"
              );
            }

            if (pathname.startsWith("")) {
              router.setParams({ query });
            } else {
            }
          }}
        >
          <Search className="text-foreground" />
        </Pressable>
      </View>
    </View>
  );
}
