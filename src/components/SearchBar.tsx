import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<Props> = ({ value, onChangeText, onSearch }) => {
  return (
    <View className="flex-row mx-5 mb-5 bg-[#1F2937] rounded-xl p-1">
      <TextInput
        className="flex-1 p-3 text-white text-base"
        placeholder="ابحث عن مدينة "
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />
      <TouchableOpacity
        className="bg-[#3B82F6] px-5 justify-center rounded-[10px]"
        onPress={onSearch}
      >
        <Text className="text-lg">🔍</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
