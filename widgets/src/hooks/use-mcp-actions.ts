import { useCallback } from 'react';
import type { McpAction } from '../types/mcpui.js';

/**
 * Actions available for widgets to communicate with the MCP host
 */
export interface McpActions {
  /**
   * Call an MCP tool with the specified parameters
   *
   * @param toolName - The name of the tool to call
   * @param params - The parameters to pass to the tool
   *
   * @example
   * const { sendToolCall } = useMcpActions();
   *
   * const handleClick = () => {
   *   sendToolCall('echo', { message: 'Hello from widget!' });
   * };
   */
  sendToolCall: (toolName: string, params: Record<string, unknown>) => void;

  /**
   * Send a prompt to the MCP host to continue the conversation
   *
   * @param prompt - The prompt text to send
   *
   * @example
   * const { sendPrompt } = useMcpActions();
   *
   * const handleContinue = () => {
   *   sendPrompt('Can you explain more about this?');
   * };
   */
  sendPrompt: (prompt: string) => void;

  /**
   * Send a custom intent to the MCP host
   *
   * @param intent - The intent name
   * @param params - Optional parameters for the intent
   *
   * @example
   * const { sendIntent } = useMcpActions();
   *
   * const handleOpenLink = () => {
   *   sendIntent('open_external', { href: 'https://example.com' });
   * };
   */
  sendIntent: (intent: string, params?: Record<string, unknown>) => void;
}

/**
 * Hook to send actions from widgets to the MCP host via postMessage
 *
 * MCP-UI widgets communicate with the host using the postMessage API.
 * This hook provides convenient methods for common actions.
 *
 * @returns Object with methods to send actions to the MCP host
 *
 * @example
 * function MyWidget() {
 *   const { sendToolCall, sendPrompt } = useMcpActions();
 *
 *   return (
 *     <div>
 *       <button onClick={() => sendToolCall('my_tool', { arg: 'value' })}>
 *         Call Tool
 *       </button>
 *       <button onClick={() => sendPrompt('Continue the conversation')}>
 *         Continue
 *       </button>
 *     </div>
 *   );
 * }
 */
export function useMcpActions(): McpActions {
  const sendMessage = useCallback((action: McpAction) => {
    try {
      window.parent.postMessage(action, '*');
    } catch (err) {
      console.error('Failed to send message to MCP host:', err);
    }
  }, []);

  const sendToolCall = useCallback(
    (toolName: string, params: Record<string, unknown>) => {
      sendMessage({
        type: 'tool',
        payload: { toolName, params },
      });
    },
    [sendMessage]
  );

  const sendPrompt = useCallback(
    (prompt: string) => {
      sendMessage({
        type: 'prompt',
        payload: { prompt },
      });
    },
    [sendMessage]
  );

  const sendIntent = useCallback(
    (intent: string, params?: Record<string, unknown>) => {
      sendMessage({
        type: 'intent',
        payload: { intent, params },
      });
    },
    [sendMessage]
  );

  return {
    sendToolCall,
    sendPrompt,
    sendIntent,
  };
}
