import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SupabaseService } from '@/services/supabaseService';
import { router } from 'expo-router';

export default function AuthScreen() {
  const colorScheme = useColorScheme();
  const [email, setEmail] = useState('test@mindforest.app');
  const [password, setPassword] = useState('testpassword123');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      if (typeof window !== 'undefined') {
        window.alert('Please enter email and password');
      }
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await SupabaseService.signIn(email, password);

      if (error) {
        // For testing: ignore email confirmation error
        if (error.message.includes('Email not confirmed')) {
          if (typeof window !== 'undefined') {
            window.alert('Note: Email not confirmed, but logging in for testing...');
          }
          router.replace('/(tabs)');
          return;
        }

        // If user doesn't exist, create account
        if (error.message.includes('Invalid login credentials')) {
          const shouldCreate = typeof window !== 'undefined'
            ? window.confirm('No account found. Would you like to create one?')
            : false;

          if (shouldCreate) {
            const { error: signUpError } = await SupabaseService.signUp(email, password);
            if (signUpError && !signUpError.message.includes('already registered')) {
              if (typeof window !== 'undefined') {
                window.alert(`Error: ${signUpError.message}`);
              }
            } else {
              // For testing: skip email confirmation and login directly
              if (typeof window !== 'undefined') {
                window.alert('Account created! Logging in...');
              }
              // Try to sign in immediately
              const { error: signInError } = await SupabaseService.signIn(email, password);
              if (!signInError || signInError.message.includes('Email not confirmed')) {
                // Ignore email confirmation error for testing
                router.replace('/(tabs)');
              }
            }
          }
        } else {
          if (typeof window !== 'undefined') {
            window.alert(`Error: ${error.message}`);
          }
        }
      } else {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      if (typeof window !== 'undefined') {
        window.alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>🌱 Mind Forest</ThemedText>
        <ThemedText style={styles.subtitle}>Welcome back</ThemedText>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              {
                color: Colors[colorScheme ?? 'light'].text,
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                borderColor: Colors[colorScheme ?? 'light'].text + '30',
              },
            ]}
            placeholder="Email"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text + '60'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={[
              styles.input,
              {
                color: Colors[colorScheme ?? 'light'].text,
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                borderColor: Colors[colorScheme ?? 'light'].text + '30',
              },
            ]}
            placeholder="Password"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text + '60'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint },
              loading && styles.buttonDisabled,
            ]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? 'Signing in...' : 'Sign In'}
            </ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.hint}>
            For testing, use the pre-filled credentials
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 50,
  },
  form: {
    gap: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hint: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.6,
    marginTop: 20,
  },
});
