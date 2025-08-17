import React, { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import Input from "./ui/Input";
import { FaCamera } from "react-icons/fa";
import { useUpdateConversation } from "../hooks/useConversations";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { useTheme } from "../contexts/ThemeContext";
import Resizer from "react-image-file-resizer";

// @ts-expect-error https://github.com/onurzorluer/react-image-file-resizer/issues/68
const resizer: typeof Resizer = Resizer.default || Resizer;

interface EditConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation | null;
}

const EditConversationModal: React.FC<EditConversationModalProps> = ({
  isOpen,
  onClose,
  conversation,
}) => {
  const [title, setTitle] = useState("");
  const [groupPictureBase64, setGroupPictureBase64] = useState<string | null>(
    null
  );
  const { mutate: updateConversation, isLoading } = useUpdateConversation();
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  // Reset form when modal opens/closes or conversation changes
  useEffect(() => {
    if (conversation && isOpen) {
      setTitle(conversation.title ?? "");
      setGroupPictureBase64(null);
    }
  }, [conversation, isOpen]);

  const handleImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      resizer.imageFileResizer(
        file,
        400,
        400,
        "JPEG",
        80,
        0,
        (uri) => {
          setGroupPictureBase64(uri as string);
        },
        "base64"
      );
    } else {
      setGroupPictureBase64(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!conversation) return;

    // Check if user is owner for group conversations
    if (conversation.isGroup && conversation.ownerId !== currentUser?.id) {
      toast.error("Only the group owner can edit conversation details", {
        style: {
          background: theme === "light" ? "" : "#262626",
          color: theme === "light" ? "" : "#fff",
        },
      });
      return;
    }

    const trimmedTitle = title.trim();

    updateConversation(
      {
        conversationId: conversation.id,
        title: trimmedTitle || null,
        img: groupPictureBase64,
      },
      {
        onSuccess: () => {
          toast.success("Conversation updated successfully!", {
            style: {
              background: theme === "light" ? "" : "#262626",
              color: theme === "light" ? "" : "#fff",
            },
          });
          onClose();
        },
        onError: (error: any) => {
          console.error(error);
          toast.error("Failed to update conversation", {
            style: {
              background: theme === "light" ? "" : "#262626",
              color: theme === "light" ? "" : "#fff",
            },
          });
        },
      }
    );
  };

  const handleClose = () => {
    setTitle("");
    setGroupPictureBase64(null);
    onClose();
  };

  if (!conversation || !conversation.isGroup) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Conversation"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Group Picture Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-32 aspect-square rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
              <img
                src={
                  groupPictureBase64 ||
                  conversation.group_picture ||
                  "default-pfp.jpg"
                }
                alt="Group picture"
                className="w-full h-full object-cover"
              />
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImgChange}
              id="group-picture"
            />
            <label
              htmlFor="group-picture"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors text-xl"
            >
              <FaCamera />
            </label>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Click the camera icon to change group picture
          </p>
        </div>

        {/* Title Section */}
        <div className="space-y-2">
          <label
            htmlFor="conversation-title"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Group Title
          </label>
          <Input
            type="text"
            id="conversation-title"
            placeholder="Enter group title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            size="lg"
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Leave empty for no title
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-800 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditConversationModal;
