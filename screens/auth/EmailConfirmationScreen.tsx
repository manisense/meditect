import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { useSupabase } from '../../context/SupabaseContext';

const EmailConfirmationScreen = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { supabase } = useSupabase();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (!url) {
          setError('Invalid confirmation link');
          return;
        }

        // Parse the URL to get the hash parameters
        const hash = url.split('#')[1];
        if (!hash) {
          setError('Invalid confirmation link');
          return;
        }

        // Parse the hash to get the access token
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const expiresIn = params.get('expires_in');
        const type = params.get('type');

        if (!accessToken || type !== 'signup') {
          setError('Invalid confirmation link');
          return;
        }

        // Set the session in Supabase
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (sessionError) throw sessionError;

        // Email is now verified, show success and redirect to login
        setIsVerifying(false);
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }, 2000);

      } catch (error) {
        console.error('Error confirming email:', error);
        setError(error instanceof Error ? error.message : 'Failed to verify email');
      } finally {
        setIsVerifying(false);
      }
    };

    handleEmailConfirmation();
  }, [navigation, supabase.auth]);

  if (isVerifying) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#246BFD" />
        <Text style={styles.verifyingText}>Verifying your email...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.successText}>Email verified successfully!</Text>
      <Text style={styles.redirectText}>Redirecting to login...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  verifyingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  successText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 12,
  },
  redirectText: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#246BFD',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmailConfirmationScreen;
