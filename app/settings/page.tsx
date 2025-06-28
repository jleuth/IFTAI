'use client';

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card"
import {Switch} from "@heroui/switch";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import React, { useState, useEffect } from "react";

export default function Settings() {
  const [formData, setFormData] = useState({
    ENABLE_WORKFLOWS: false,
    ENABLE_WEBHOOKS: false,
    ENABLE_TELEGRAM: false,
    ENABLE_OPENAI: false,
    OPENAI_API_KEY: '',
    TELEGRAM_BOT_API_KEY: '',
    CHAT_ID: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSwitchChange = (key: string) => (value: boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleInputChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Failed to save settings');
      }
    } catch (error) {
      setMessage('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 mb-8">
                <Switch 
                  isSelected={formData.ENABLE_WORKFLOWS} 
                  onValueChange={handleSwitchChange('ENABLE_WORKFLOWS')}
                >
                  Enable running workflows
                </Switch>
                <Switch 
                  isSelected={formData.ENABLE_WEBHOOKS} 
                  onValueChange={handleSwitchChange('ENABLE_WEBHOOKS')}
                >
                  Enable webhooks
                </Switch>
                <Switch 
                  isSelected={formData.ENABLE_TELEGRAM} 
                  onValueChange={handleSwitchChange('ENABLE_TELEGRAM')}
                >
                  Enable sending messages with Telegram
                </Switch>
                <Switch 
                  isSelected={formData.ENABLE_OPENAI} 
                  onValueChange={handleSwitchChange('ENABLE_OPENAI')}
                >
                  Enable OpenAI
                </Switch>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                <Input 
                  label="OpenAI API key" 
                  labelPlacement="outside" 
                  placeholder={formData.OPENAI_API_KEY}
                  onChange={handleInputChange('OPENAI_API_KEY')}
                  type="password"
                />
                <Input 
                  label="Telegram Bot key" 
                  labelPlacement="outside" 
                  placeholder={formData.TELEGRAM_BOT_API_KEY}
                  onChange={handleInputChange('TELEGRAM_BOT_API_KEY')}
                  type="password"
                />
                <Input 
                  label="Telegram Chat ID" 
                  labelPlacement="outside" 
                  placeholder={formData.CHAT_ID}
                  onChange={handleInputChange('CHAT_ID')}
                />
              </div>

              <Button 
                type="submit" 
                color="primary" 
                isLoading={loading}
                className="mb-4"
              >
                Save Settings
              </Button>

              {message && (
                <div className={`text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </div>
              )}
            </form>
        </div>
    </div>
  )
}