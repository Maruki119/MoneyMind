import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedButton } from "@/components/ThemedButton";
import { AuthContext } from "@/hooks/conText/AuthContext";
import { useContext } from "react";
import { router } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { UserContext } from "@/hooks/conText/UserContext";

import Feather from "@expo/vector-icons/Feather";
import { View } from "react-native";

export default function Setting() {
  const auth = useContext(AuthContext);
  const theme = useColorScheme();
  const isDarkMode = theme === "dark";

  const bgColor = isDarkMode ? "bg-gray-700" : "bg-gray-100";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const componentColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const componentIcon = isDarkMode ? "#f2f2f2" : "#2f2f2f";
  const logoutColor = isDarkMode ? "bg-gray-800" : "bg-gray-200";

  const { username } = useContext(UserContext);

  return (
    <ThemedSafeAreaView>
      {/* Header */}
      <ThemedText
        className={`text-[24px] font-bold mx-5 pt-[15%] ${textColor}`}
      >
        Setting
      </ThemedText>

      {/* Profile Account Setting */}
      <View className="mt-5 mb-[15%] mx-4">
        <Pressable
          className={`flex-row items-center !justify-start px-4 py-3 rounded-lg ${componentColor} ${borderColor} border`}
          onPress={() => router.push("/Account_Detail")}
        >
          <View className="pl-2 pr-4">
            {/* ใส่ padding ซ้ายและขวาให้ไอคอน */}
            <Feather name="circle" size={30} color={componentIcon} />
          </View>
          <View className="flex-1">
            <ThemedText className={`text-[18px] font-bold ${textColor}`}>
              {username ? username : "FirstName LastName"}
            </ThemedText>
            <ThemedText className="text-gray-500 text-[14px]">
              Profile, account setting
            </ThemedText>
          </View>
          <Feather name="chevron-right" size={24} color={componentIcon} />
        </Pressable>
      </View>

      {/* เมนูตั้งค่า */}
      <View className="mt-5 space-y-3 mx-4">
        {/* Notification Setting path */}
        <Pressable
          className={`flex-row items-center !justify-start px-4 py-3 rounded-lg ${componentColor} ${borderColor} border`}
          onPress={() => router.push("../NotificationSetting")}
        >
          <ThemedText className={`flex-1 text-[18px] font-bold ${textColor}`}>
            Notification
          </ThemedText>
          <Feather name="chevron-right" size={24} color={componentIcon} />
        </Pressable>

        {/* Change Pin Password path */}
        <Pressable
          className={`flex-row items-center !justify-start px-4 py-3 rounded-lg ${componentColor} ${borderColor} border`}
          onPress={() => router.push("../PinRecovery")}
        >
          <ThemedText className={`flex-1 text-[18px] font-bold ${textColor}`}>
            Change Pin
          </ThemedText>
          <Feather name="chevron-right" size={24} color={componentIcon} />
        </Pressable>

        {/* Icon Transaction path */}
        <Pressable
          className={`flex-row items-center !justify-start px-4 py-3 rounded-lg ${componentColor} ${borderColor} border`}
          onPress={() => router.push("../IconTransaction")}
        >
          <ThemedText className={`flex-1 text-[18px] font-bold ${textColor}`}>
            Icon Transaction
          </ThemedText>
          <Feather name="chevron-right" size={24} color={componentIcon} />
        </Pressable>
      </View>

      {/* Logout */}
      <View className="mt-10 border-gray-300 pt-[60%] mx-4">
        <ThemedButton
          className={`w-full py-3 rounded-lg ${logoutColor}`}
          mode="cancel"
          textClassName={`text-[18px] font-bold ${textColor}`}
          onPress={() => {
            auth?.logout();
            router.replace("/Welcome");
          }}
        >
          <ThemedText className="text-[18px] font-bold">
            Logout
          </ThemedText>
        </ThemedButton>
      </View>
    </ThemedSafeAreaView>
  );
}
