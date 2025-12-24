import { useState, useEffect } from 'react';
import type { ToolOutput } from '../types/mcpui.js';

/**
 * Hook to parse tool output data from URL query parameters
 *
 * MCP-UI passes tool output via `?data=<JSON>` query parameter.
 * This hook parses and returns the data with proper error handling.
 *
 * @template T - The expected shape of the tool output data
 * @returns The parsed tool output data, or null if not available
 *
 * @example
 * interface MyToolOutput {
 *   message: string;
 *   timestamp: string;
 * }
 *
 * function MyWidget() {
 *   const toolOutput = useToolOutput<MyToolOutput>();
 *
 *   if (!toolOutput) return <div>No data</div>;
 *
 *   return <div>{toolOutput.message}</div>;
 * }
 */
export function useToolOutput<T extends ToolOutput>(): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');

    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam));
        setData(parsed as T);
      } catch (err) {
        console.error('Failed to parse tool output from URL parameter:', err);
        setData(null);
      }
    }
  }, []);

  return data;
}
