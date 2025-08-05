/**
 * Terminal Service - Handles terminal command execution via API
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

export interface TerminalCommandResponse {
  success: boolean;
  data?: {
    command: string;
    response: string;
    shouldClear?: boolean;
    isError?: boolean;
    timestamp?: string;
  };
  error?: string;
}

export interface TerminalConfig {
  enableTerminal: boolean;
  availableCommands: string[];
  commandResponses: Record<string, string>;
}

/**
 * Execute a terminal command for specific content
 */
export const executeTerminalCommand = async (
  contentId: string,
  command: string,
  token: string
): Promise<TerminalCommandResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/terminal/${contentId}/execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ command }),
      }
    );

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Failed to execute command";
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If JSON parsing fails, use the raw text or default message
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Terminal command execution error:", error);

    // Check if this is a network/service worker related error
    if (error instanceof TypeError && error.message.includes("body stream")) {
      return {
        success: false,
        error: "Network connection issue. Please try again.",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Get terminal configuration for specific content
 */
export const getTerminalConfig = async (
  contentId: string,
  token: string
): Promise<{
  success: boolean;
  data?: { terminalConfig: TerminalConfig };
  error?: string;
}> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/terminal/${contentId}/config`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to get terminal config");
    }

    return data;
  } catch (error) {
    console.error("Get terminal config error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Update terminal configuration for specific content (admin only)
 */
export const updateTerminalConfig = async (
  contentId: string,
  terminalConfig: Partial<TerminalConfig>,
  token: string
): Promise<{
  success: boolean;
  data?: { terminalConfig: TerminalConfig };
  error?: string;
}> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/terminal/${contentId}/config`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ terminalConfig }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update terminal config");
    }

    return data;
  } catch (error) {
    console.error("Update terminal config error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
