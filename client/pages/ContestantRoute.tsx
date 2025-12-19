import { useParams } from "react-router-dom";
import { SocketProvider } from "../src/socket/SocketProvider";
import ContestantGame from "./ContestantGame";


export default function ContestantRoute() {
  const { game_id, user_id } = useParams();
  const safeGameId = game_id ?? "";
  return (
    <SocketProvider userId={user_id ?? ""} role="contestant" gameId={safeGameId}>
      <ContestantGame />
    </SocketProvider>
  );
}