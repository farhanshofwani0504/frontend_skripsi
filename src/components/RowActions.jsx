import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

/**
 * Kebabs menu untuk kolom Aksi.
 * @param {object}   props
 * @param {object}   props.k         - objek karyawan
 * @param {object}   props.onActions - { penilaian, email, edit, delete, rekap }
 */
export default function RowActions({ k, onActions }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 hover:bg-slate-200 rounded">
          <MoreVertical size={18} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => onActions.penilaian(k)}>
          Penilaian
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onActions.email(k)}>
          Kirim Email
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onActions.edit(k)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => onActions.delete(k)}
        >
          Delete
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onActions.rekap(k)}>
          Rekap
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onActions.downloadPdf(k)}>
          Download PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
