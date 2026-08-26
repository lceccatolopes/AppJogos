import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarButton: HapticTab,

        tabBarActiveTintColor: '#B98BFF',
        tabBarInactiveTintColor: '#5C567F',

        tabBarStyle: {
          position: 'absolute',
          left: 18,
          right: 18,
          bottom: 18,
          height: 66,
          backgroundColor: '#1D1846',
          borderTopWidth: 0,
          borderWidth: 2,
          borderColor: '#372C6E',
          borderRadius: 24,
          paddingTop: 8,
          elevation: 6,
          shadowColor: '#000000',
          shadowOpacity: 0.3,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '900',
        },

        tabBarItemStyle: {
          paddingTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jogos',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'game-controller' : 'game-controller-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progresso',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'stats-chart' : 'stats-chart-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="invocation"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="collection"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}