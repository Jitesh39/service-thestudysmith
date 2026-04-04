"use client";

import React, { useState, useEffect } from 'react';
import { getFCMToken, requestPermission } from '@/lib/notifications';

const FCMTestPage = () => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('Initializing...');

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        setLoading(true);
        try {
            const hasPermission = await requestPermission();
            if (hasPermission) {
                const fcmToken = await getFCMToken();
                setToken(fcmToken);
                setStatus(fcmToken ? 'Ready to receive notifications!' : 'Permission granted but token generation failed.');
            } else {
                setStatus('Notification permission denied.');
            }
        } catch (error) {
            setStatus('Error: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (token) {
            navigator.clipboard.writeText(token);
            alert('Token copied to clipboard!');
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a202c' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '2rem', border: '1px solid #e2e8f0' }}>
                <h1 style={{ marginTop: 0, color: '#2d3748', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    Firebase Cloud Messaging (FCM) Tester
                </h1>

                <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontWeight: '500', marginBottom: '0.5rem', color: '#4a5568' }}>Status:</p>
                    <div style={{ padding: '0.75rem', backgroundColor: '#f7fafc', borderRadius: '6px', border: '1px solid #edf2f7', fontSize: '0.9rem' }}>
                        {status}
                    </div>
                </div>

                {token && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <p style={{ fontWeight: '500', marginBottom: '0.5rem', color: '#4a5568' }}>Your FCM Device Token:</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <code style={{ flex: 1, padding: '0.75rem', backgroundColor: '#f0f4f8', borderRadius: '6px', fontSize: '0.8rem', wordBreak: 'break-all', display: 'block' }}>
                                {token}
                            </code>
                            <button
                                onClick={copyToClipboard}
                                style={{ padding: '0.5rem 1rem', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', transition: 'background 0.2s' }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2b6cb0')}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3182ce')}
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#2d3748' }}>How to send a Test Notification</h2>
                    <p style={{ fontSize: '0.9rem', color: '#718096', lineHeight: '1.5', marginBottom: '1rem' }}>
                        To send a test notification to this specific device, you can use the Firebase Console or a Server-side script.
                        Note: The legacy FCM API (Server Key) is deprecated. Use the new Firebase Cloud Messaging API (HTTP v1) for production.
                    </p>

                    <div style={{ backgroundColor: '#2d3748', color: '#fff', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
                        <pre style={{ margin: 0, fontSize: '0.85rem' }}>
                            {`// Example payload for testing
{
  "message": {
    "token": "${token || 'YOUR_TOKEN_HERE'}",
    "notification": {
      "title": "Hello from FCM!",
      "body": "This is a test notification."
    },
    "webpush": {
      "fcm_options": {
        "link": "https://thestudysmith.com"
      }
    }
  }
}`}
                        </pre>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={checkStatus}
                        disabled={loading}
                        style={{ padding: '0.75rem 1.5rem', backgroundColor: '#edf2f7', color: '#4a5568', border: '1px solid #cbd5e0', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500' }}
                    >
                        {loading ? 'Refreshing...' : 'Refresh Token'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FCMTestPage;
