import { FC } from "react";
import { axiosPrivate } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ContactProps {
  img: string;
  id: number;
  username: string;
}

const Contact: FC<ContactProps> = ({ img, id, username }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const handleClick = async () => {
    const res = await axiosPrivate.post("/api/conversations/new", {
      creatorId: currentUser?.id,
      joinerId: id
    })
    console.log(res.data);
    navigate(`/${res.data.id}`)
  }
  return (
    <div onClick={handleClick} className="rounded-xl flex gap-3 p-2 items-center cursor-pointer hover:bg-neutral-300">
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={img}
          alt="profile picture"
          className="object-cover w-full h-full"
        />
      </div>
      <h2 className="text-lg">{username}</h2>
    </div>
  );
};

export default Contact;
