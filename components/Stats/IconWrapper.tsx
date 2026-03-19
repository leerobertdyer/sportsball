import { Edit, Trash } from "lucide-react";

const ICON_MAP = {
  trash: <Trash fill="red" className="w-4 h-4" />,
  edit: <Edit fill="gold" className="w-4 h-4" />,
};

export default function IconWrapper({ kind, onClick }: { kind: keyof typeof ICON_MAP, onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-my-green-base hover:bg-my-yellow-base active:bg-my-yellow-dark min-h-[44px] min-w-[44px] p-2 rounded-lg inline-flex items-center justify-center border-2 border-black cursor-pointer touch-manipulation"
    >
      {ICON_MAP[kind]}
    </button>
  );
}