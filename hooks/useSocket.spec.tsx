import React from "react";
import { renderHook } from "@testing-library/react";
import { useSocket } from "./useSocket";
import { SocketContext } from "@/app/contexts/Socket.Context";

describe("useSocket", () => {
  it("should return SocketContext", () => {
    const mockContextValue: React.ContextType<typeof SocketContext> = {
      dataFlowState: "stopped",
      connectionState: "connecting",
      lastUpdate: null,
      handleDataFlow: jest.fn(),
      connectionErrorMessage: null,
      statsLoading: true,
      reconnectAttempt: 0,
      total: 0,
      counts: Array(11).fill(0),
    } as const;

    const wrapper = ({ children }: { children: React.ReactNode }) => {
      return (
        <SocketContext.Provider value={mockContextValue}>
          {children}
        </SocketContext.Provider>
      );
    };

    const { result } = renderHook(() => useSocket(), { wrapper });

    expect(result.current).toBe(mockContextValue);
  });
});
