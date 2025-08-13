import { useLocation } from "react-router-dom";
import Chat from "./Chat";
import ConversationInfo from "./ConversationInfo";

const Main = () => {
  const location = useLocation();

  const isInfoRoute = /^\/\d+\/info$/.test(location.pathname);

  return (
    <div className="flex-grow sm:block">
      {isInfoRoute ? <ConversationInfo /> : <Chat />}
    </div>
  );
};

export default Main;
