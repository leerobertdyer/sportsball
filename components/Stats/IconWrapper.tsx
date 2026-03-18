import { Edit, Trash } from "lucide-react";

const ICON_MAP = {
  trash: <Trash fill="red" className="w-4 h-4" />,
  edit: <Edit fill="gold" className="w-4 h-4" />,
};

export default function IconWrapper({ kind, onClick }: { kind: keyof typeof ICON_MAP, onClick: () => void }) {
  return (
    <div 
    onClick={onClick}
    className="bg-my-green-base hover:bg-my-yellow-base p-2 rounded-lg inline-block border-2 border-black cursor-pointer">
      {ICON_MAP[kind]}
    </div>
  );
}