import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { styled } from 'nativewind';
import api from '../services/api';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/login', {
                email,
                password
            });
            Alert.alert('Success', `Welcome back! Token: ${res.data.token.substring(0, 10)}...`);
            console.log('Login success:', res.data);
        } catch (error: any) {
            console.log('Login error:', error.response?.data || error.message);
            Alert.alert('Login Failed', error.response?.data?.error || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50 justify-center">
            <View className="px-8">
                <View className="items-center mb-10">
                    <Text className="text-4xl font-bold text-blue-600">DigitBill</Text>
                    <Text className="text-gray-500 mt-2">Mobile Edition</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-700 mb-2 font-medium">Email</Text>
                        <TextInput 
                            className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-800"
                            placeholder="user@example.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                        <TextInput 
                            className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-800"
                            placeholder="********"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity 
                        onPress={handleLogin}
                        className={`bg-blue-600 py-4 rounded-xl items-center mt-6 ${loading ? 'opacity-70' : ''}`}
                        disabled={loading}
                    >
                        <Text className="text-white font-bold text-lg">
                            {loading ? 'Logging in...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;
