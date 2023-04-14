import { FC } from "react";

interface ContactProps {
  img: string;
  username: string;
}

const Contact: FC<ContactProps> = ({ img, username }) => {
  return (
    <div className="rounded-xl flex gap-3 p-2 items-center cursor-pointer hover:bg-neutral-300">
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
