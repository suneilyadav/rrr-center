import AsyncStorage from "@react-native-async-storage/async-storage";

export const getLoggedInUser = async () => {
  const data = await AsyncStorage.getItem("user");
  if (!data) return null;
  return JSON.parse(data);
};

export const getUserEmail = async () => {
  const user = await getLoggedInUser();
  return user?.email || null;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem("user");
};

