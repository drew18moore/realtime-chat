import { useLocation } from "react-router-dom";
import NewConversation from "./NewConversation";
import NewGroup from "./NewGroup";
import Inbox from "./Inbox";

const Sidebar = () => {
  const location = useLocation();

  const isRootRoute = location.pathname === "/";
  const isNewMessageRoute = location.pathname === "/new";
  const isNewGroupRoute = location.pathname === "/new/group";
  const isNewRoute = isNewMessageRoute || isNewGroupRoute;

  return (
    <div className={`h-[calc(100svh)] w-full ${isRootRoute || isNewRoute ? "block" : "hidden"} block sm:w-96 sm:block relative border-0 sm:border-r-[1px] sm:border-r-neutral-200 dark:sm:border-r-neutral-800`}>
      {isNewRoute ? (
        isNewGroupRoute ? (
          <NewGroup />
        ) : (
          <NewConversation />
        )
      ) : (
        <Inbox />
      )}
    </div>
  );
};

export default Sidebar;
