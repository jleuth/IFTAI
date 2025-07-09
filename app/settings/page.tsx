"use client";

import { Switch } from "@heroui/switch";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import React, { useState, useEffect } from "react";
import { isDemoMode, demoConfig } from "@/config/demo";

import PageTitle from "@/components/PageTitle";

export default function Settings() {
  const [formData, setFormData] = useState({
    ENABLE_WORKFLOWS: false,
    ENABLE_WEBHOOKS: false,
    ENABLE_TELEGRAM: false,
    ENABLE_OPENAI: false,
    OPENAI_API_KEY: "",
    TELEGRAM_BOT_API_KEY: "",
    CHAT_ID: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings", {
        headers: {
          "x-auth-token": process.env.NEXT_PUBLIC_AUTH_TOKEN as string,
        },
      });

      if (response.ok) {
        const data = await response.json();

        setFormData(data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleSwitchChange = (key: string) => (value: boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleInputChange =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": process.env.NEXT_PUBLIC_AUTH_TOKEN as string,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Settings saved successfully!");
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Failed to save settings");
      }
    } catch (error) {
      setMessage("Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <PageTitle>Settings</PageTitle>

        {isDemoMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Demo Mode Active</h3>
            <p className="text-blue-700 text-sm">
              Settings changes are disabled in demo mode for security. 
              External API calls are mocked and some features are restricted.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 mb-8">
            <Switch
              isSelected={formData.ENABLE_WORKFLOWS}
              isDisabled={isDemoMode && !demoConfig.allowSettingsChange}
              onValueChange={handleSwitchChange("ENABLE_WORKFLOWS")}
            >
              Enable running workflows
            </Switch>
            <Switch
              isSelected={formData.ENABLE_WEBHOOKS}
              isDisabled={isDemoMode && !demoConfig.allowSettingsChange}
              onValueChange={handleSwitchChange("ENABLE_WEBHOOKS")}
            >
              Enable webhooks
            </Switch>
            <Switch
              isSelected={formData.ENABLE_TELEGRAM}
              isDisabled={isDemoMode && !demoConfig.allowSettingsChange}
              onValueChange={handleSwitchChange("ENABLE_TELEGRAM")}
            >
              Enable sending messages with Telegram {isDemoMode && "(Mocked in demo)"}
            </Switch>
            <Switch
              isSelected={formData.ENABLE_OPENAI}
              isDisabled={isDemoMode && !demoConfig.allowSettingsChange}
              onValueChange={handleSwitchChange("ENABLE_OPENAI")}
            >
              Enable OpenAI {isDemoMode && "(Mocked in demo)"}
            </Switch>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <Input
              label="OpenAI API key"
              labelPlacement="outside"
              placeholder={isDemoMode ? "Hidden in demo mode" : formData.OPENAI_API_KEY}
              type="password"
              isDisabled={isDemoMode && !demoConfig.allowSettingsChange}
              onChange={handleInputChange("OPENAI_API_KEY")}
            />
            <Input
              label="Telegram Bot key"
              labelPlacement="outside"
              placeholder={isDemoMode ? "Hidden in demo mode" : formData.TELEGRAM_BOT_API_KEY}
              type="password"
              isDisabled={isDemoMode && !demoConfig.allowSettingsChange}
              onChange={handleInputChange("TELEGRAM_BOT_API_KEY")}
            />
            <Input
              label="Telegram Chat ID"
              labelPlacement="outside"
              placeholder={isDemoMode ? "Hidden in demo mode" : formData.CHAT_ID}
              isDisabled={isDemoMode && !demoConfig.allowSettingsChange}
              onChange={handleInputChange("CHAT_ID")}
            />
          </div>

          <Button
            className="mb-4"
            color="primary"
            isLoading={loading}
            type="submit"
            isDisabled={isDemoMode && !demoConfig.allowSettingsChange}
          >
            {isDemoMode && !demoConfig.allowSettingsChange ? "Disabled in Demo" : "Save Settings"}
          </Button>

          {message && (
            <div
              className={`text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
