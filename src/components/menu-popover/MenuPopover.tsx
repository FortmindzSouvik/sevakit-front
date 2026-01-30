import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type MenuPopoverProps = {
  triggerIcon: string;

  /** Optional actions */
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;

  editLabel?: string;
  deleteLabel?: string;
  downloadLabel?: string;

  editIcon?: string;
  deleteIcon?: string;
  downloadIcon?: string;
};

export default function MenuPopover({
  triggerIcon,

  onEdit,
  onDelete,
  onDownload,

  editLabel = "Edit",
  deleteLabel = "Delete",
  downloadLabel = "Download",

  editIcon = "/../icons/edit-color-icon.svg",
  deleteIcon = "/../icons/delete-red-icon.svg",
  downloadIcon = "/../icons/dwnload-color-icon.svg",
}: MenuPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <img
            src={triggerIcon}
            className="w-fit h-fit mt-2 cursor-pointer"
            alt="menu"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-44 p-2 rounded-xl shadow-md border bg-white font-mona"
      >
        {/* Download */}
        {onDownload && (
          <button
            onClick={onDownload}
            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 rounded-lg text-[#009FB6] text-sm font-medium cursor-pointer"
          >
            <img src={downloadIcon} className="w-4 h-4" alt="download" />
            <span>{downloadLabel}</span>
          </button>
        )}

        {/* Edit */}
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 rounded-lg text-[#009FB6] text-sm font-medium cursor-pointer"
          >
            <img src={editIcon} className="w-4 h-4" alt="edit" />
            <span>{editLabel}</span>
          </button>
        )}

        {/* Delete */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 rounded-lg text-[#FF0000] text-sm font-medium cursor-pointer"
          >
            <img src={deleteIcon} className="w-4 h-4" alt="delete" />
            <span>{deleteLabel}</span>
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}
