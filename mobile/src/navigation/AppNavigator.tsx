import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize } from '../lib/theme';

import { HomeScreen } from '../screens/HomeScreen';
import { EventsScreen } from '../screens/EventsScreen';
import { CarCruiseScreen } from '../screens/CarCruiseScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { DirectoryScreen } from '../screens/DirectoryScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { SponsorshipScreen } from '../screens/SponsorshipScreen';
import { ContactScreen } from '../screens/ContactScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function CarCruiseStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600', fontSize: fontSize.md },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="CarCruiseMain" component={CarCruiseScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register Vehicle' }} />
      <Stack.Screen name="Sponsorship" component={SponsorshipScreen} options={{ title: 'Sponsorship' }} />
    </Stack.Navigator>
  );
}

function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600', fontSize: fontSize.md },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="MoreMain" component={MoreScreen} options={{ headerShown: false }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About IBPA' }} />
      <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact Us' }} />
      <Stack.Screen name="Sponsorship" component={SponsorshipScreen} options={{ title: 'Sponsorship' }} />
    </Stack.Navigator>
  );
}

const tabIcons: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Events: { active: 'calendar', inactive: 'calendar-outline' },
  CarCruise: { active: 'car-sport', inactive: 'car-sport-outline' },
  Directory: { active: 'storefront', inactive: 'storefront-outline' },
  More: { active: 'ellipsis-horizontal', inactive: 'ellipsis-horizontal-outline' },
};

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            paddingBottom: 4,
            height: 56,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          tabBarIcon: ({ focused, color, size }) => {
            const icons = tabIcons[route.name];
            const iconName = focused ? icons.active : icons.inactive;
            return <Ionicons name={iconName} size={22} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Events" component={EventsScreen} options={{ headerShown: true, headerTitle: 'Events', headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false }} />
        <Tab.Screen name="CarCruise" component={CarCruiseStack} options={{ tabBarLabel: 'Car Cruise' }} />
        <Tab.Screen name="Directory" component={DirectoryScreen} options={{ headerShown: true, headerTitle: 'Business Directory', headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false }} />
        <Tab.Screen name="More" component={MoreStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
