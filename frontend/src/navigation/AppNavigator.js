import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES } from '../theme/colors';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/home/HomeScreen';
import ServicesScreen from '../screens/services/ServicesScreen';
import ServiceDetailScreen from '../screens/services/ServiceDetailScreen';
import BookingFormScreen from '../screens/booking/BookingFormScreen';
import MyBookingsScreen from '../screens/booking/MyBookingsScreen';
import BookingDetailScreen from '../screens/booking/BookingDetailScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SupportScreen from '../screens/support/SupportScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminBookingsScreen from '../screens/admin/AdminBookingsScreen';
import AdminBookingDetailScreen from '../screens/admin/AdminBookingDetailScreen';
import AdminServicesScreen from '../screens/admin/AdminServicesScreen';
import AdminServiceFormScreen from '../screens/admin/AdminServiceFormScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Simple icon component using Unicode/Emoji (to avoid native module issues)
const TabIcon = ({ name, focused, color }) => {
  const icons = {
    Home: '🏠',
    Services: '🔧',
    Bookings: '📋',
    Notifications: '🔔',
    Profile: '👤',
    // Admin tabs
    Dashboard: '📊',
    Users: '👥',
    AdminBookings: '📋',
    AdminServices: '🔧',
  };

  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.5 }]}>
        {icons[name] || '📱'}
      </Text>
    </View>
  );
};

// Home Stack
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: '700' },
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    <Stack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ServiceDetail"
      component={ServiceDetailScreen}
      options={{ title: 'Service Details' }}
    />
    <Stack.Screen
      name="BookingForm"
      component={BookingFormScreen}
      options={{ title: 'Book Service' }}
    />
  </Stack.Navigator>
);

// Services Stack
const ServicesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: '700' },
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    <Stack.Screen
      name="ServicesMain"
      component={ServicesScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ServiceDetail"
      component={ServiceDetailScreen}
      options={{ title: 'Service Details' }}
    />
    <Stack.Screen
      name="BookingForm"
      component={BookingFormScreen}
      options={{ title: 'Book Service' }}
    />
  </Stack.Navigator>
);

// Bookings Stack
const BookingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: '700' },
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    <Stack.Screen
      name="BookingsMain"
      component={MyBookingsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="BookingDetail"
      component={BookingDetailScreen}
      options={{ title: 'Booking Details' }}
    />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: '700' },
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Support"
      component={SupportScreen}
      options={{ title: 'Help & Support' }}
    />
  </Stack.Navigator>
);

// ============ ADMIN STACKS ============

// Admin Dashboard Stack
const AdminDashboardStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: '700' },
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    <Stack.Screen
      name="AdminDashboardMain"
      component={AdminDashboardScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Admin Users Stack
const AdminUsersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: '700' },
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    <Stack.Screen
      name="AdminUsersMain"
      component={AdminUsersScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Admin Bookings Stack
const AdminBookingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: '700' },
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    <Stack.Screen
      name="AdminBookingsMain"
      component={AdminBookingsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AdminBookingDetail"
      component={AdminBookingDetailScreen}
      options={{ title: 'Manage Booking' }}
    />
  </Stack.Navigator>
);

// Admin Services Stack
const AdminServicesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: '700' },
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    <Stack.Screen
      name="AdminServicesMain"
      component={AdminServicesScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AdminServiceForm"
      component={AdminServiceFormScreen}
      options={({ route }) => ({
        title: route.params?.service ? 'Edit Service' : 'New Service',
      })}
    />
  </Stack.Navigator>
);

// Main Tab Navigator (regular users)
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color }) => (
        <TabIcon name={route.name} focused={focused} color={color} />
      ),
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,
      tabBarStyle: {
        backgroundColor: COLORS.surface,
        borderTopColor: COLORS.divider,
        borderTopWidth: 1,
        height: 65,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Services" component={ServicesStack} />
    <Tab.Screen name="Bookings" component={BookingsStack} />
    <Tab.Screen name="Notifications" component={NotificationsScreen} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>
);

// Admin Tab Navigator
const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color }) => (
        <TabIcon name={route.name} focused={focused} color={color} />
      ),
      tabBarActiveTintColor: COLORS.secondary,
      tabBarInactiveTintColor: COLORS.textMuted,
      tabBarStyle: {
        backgroundColor: COLORS.surface,
        borderTopColor: COLORS.secondary + '30',
        borderTopWidth: 1,
        height: 65,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={AdminDashboardStack} />
    <Tab.Screen
      name="Users"
      component={AdminUsersStack}
    />
    <Tab.Screen
      name="AdminBookings"
      component={AdminBookingsStack}
      options={{ title: 'Bookings' }}
    />
    <Tab.Screen
      name="AdminServices"
      component={AdminServicesStack}
      options={{ title: 'Services' }}
    />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>
);

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: COLORS.background },
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>🔧</Text>
        <Text style={styles.loadingTitle}>TechCare</Text>
        <Text style={styles.loadingSubtitle}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (isAdmin ? <AdminTabs /> : <MainTabs />) : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 22,
  },
});

export default AppNavigator;
