import { useParams } from "react-router-dom";
import { SocketProvider } from "../src/socket/SocketProvider";
import HostWaitingRoom from "./HostWaitingRoom";

export default function HostRoute() {
  const { game_id, user_id } = useParams();

    if(!game_id) return <div>Invalid game ID</div>;

  return (
    <SocketProvider userId={user_id ?? ""} role="host" gameId={game_id}>
      <HostWaitingRoom />
    </SocketProvider>
  );
}