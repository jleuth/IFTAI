export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const demoConfig = {
  allowWorkflowCreation: true,
  allowWorkflowEdit: true,
  allowSettingsChange: false,
  maxWorkflows: 10,
  restrictedActions: ['telegram'], // Disable actual external calls in demo
  mockResponses: {
    ai: "This is a simulated AI response for demo purposes. In a real environment, this would be generated by the selected model.",
    telegram: { success: true, message: "Demo: Message would be sent to Telegram" },
    request: { demo: true, message: "This is a mocked HTTP response for demo purposes" }
  }
};

// Utility function to get the correct workflows file path based on demo mode
export function getWorkflowsFilePath(): string {
  return isDemoMode ? "app/workflows.demo.json" : "app/workflows.json";
}