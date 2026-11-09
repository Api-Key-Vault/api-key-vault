import { useEffect } from "react";
import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

export function useTeamSignalR(
  teamIds: number[],
  onMembersChanged: () => void,
  enabled: boolean,
) {
  const teamIdsKey = teamIds.join(",");

  useEffect(() => {
    if (!enabled || teamIdsKey === "") {
      return;
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const hubUrl = baseUrl.replace(/\/api\/?$/, "/hubs/team");
    let cancelled = false;

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    connection.on("TeamMembersChanged", () => {
      if (!cancelled) {
        onMembersChanged();
      }
    });

    connection.onreconnected(async () => {
      try {
        for (const id of teamIds) {
          if (cancelled) break;
          await connection.invoke("JoinTeam", id);
        }

        if (!cancelled) {
          onMembersChanged();
        }
      } catch (error) {
        console.error("Failed to rejoin SignalR teams:", error);
      }
    });

    async function startConnection() {
      try {
        await connection.start();

        if (cancelled) {
          await connection.stop();
          return;
        }
        for (const id of teamIds) {
          if (cancelled) break;
          await connection.invoke("JoinTeam", id);
        }
      } catch (error) {
        console.error("Failed to connect or join SignalR team:", error);
      }
    }

    startConnection();

    return () => {
      cancelled = true;

      if (connection.state === HubConnectionState.Connected) {
        void connection.stop();
      }
    };
  }, [teamIdsKey, onMembersChanged, enabled]);
}
