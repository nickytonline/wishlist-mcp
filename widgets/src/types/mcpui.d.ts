/**
 * TypeScript declarations for MCP-UI postMessage API
 * Based on MCP-UI documentation
 */

/**
 * Actions that can be sent from widgets to the MCP host via postMessage
 */
export type McpAction =
  | McpToolAction
  | McpPromptAction
  | McpIntentAction;

/**
 * Call an MCP tool from within a widget
 */
export interface McpToolAction {
  type: 'tool';
  payload: {
    toolName: string;
    params: Record<string, unknown>;
  };
}

/**
 * Send a prompt to the MCP host (e.g., continue conversation)
 */
export interface McpPromptAction {
  type: 'prompt';
  payload: {
    prompt: string;
  };
}

/**
 * Send a custom intent to the MCP host
 */
export interface McpIntentAction {
  type: 'intent';
  payload: {
    intent: string;
    params?: Record<string, unknown>;
  };
}

/**
 * Tool output data structure (generic)
 * Widgets receive this via URL query parameter `?data=...`
 */
export interface ToolOutput {
  [key: string]: unknown;
}

declare global {
  interface Window {
    /**
     * Post messages to the MCP host
     * Used for tool calls, prompts, and custom intents
     */
    parent: {
      postMessage(message: McpAction, targetOrigin: string): void;
    };
  }
}

export {};
