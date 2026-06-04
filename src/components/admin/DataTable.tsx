"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Search, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";

interface Column<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onToggleActive?: (row: T) => void;
  searchKey?: keyof T;
  searchPlaceholder?: string;
}

export default function DataTable<T extends { id: string; isActive?: boolean }>({
  data,
  columns,
  onEdit,
  onDelete,
  onToggleActive,
  searchKey,
  searchPlaceholder = "Arama yap...",
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter((row) => {
    if (!searchKey || !searchQuery) return true;
    const val = row[searchKey];
    if (typeof val === "string") {
      return val.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="relative max-w-sm select-none">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="pl-10 rounded-xl border-[#D1D1D6] text-sm focus:ring-[#007AFF] focus:border-[#007AFF] transition-all bg-white"
          />
        </div>
      )}

      <div className="rounded-2xl border border-[#D1D1D6] bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[#F2F2F7]">
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx} className="text-xs font-bold text-[#1D1D1F] px-4 py-3 select-none">
                  {col.header}
                </TableHead>
              ))}
              {(onEdit || onDelete || onToggleActive) && (
                <TableHead className="text-xs font-bold text-[#1D1D1F] px-4 py-3 text-right select-none">
                  İşlemler
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <TableRow key={row.id || (row as any).entityId || idx} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col, colIdx) => (
                    <TableCell key={colIdx} className="px-4 py-3 text-sm text-[#1D1D1F] font-medium">
                      {typeof col.accessorKey === "function"
                        ? col.accessorKey(row)
                        : (row[col.accessorKey] as React.ReactNode)}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete || onToggleActive) && (
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onToggleActive && row.isActive !== undefined && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onToggleActive(row)}
                            className="w-8 h-8 rounded-lg text-[#86868B] hover:text-[#007AFF]"
                            title={row.isActive ? "Pasifleştir" : "Aktifleştir"}
                          >
                            {row.isActive ? <Eye className="w-4 h-4 text-[#34C759]" /> : <EyeOff className="w-4 h-4 text-[#FF9500]" />}
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(row)}
                            className="w-8 h-8 rounded-lg text-[#86868B] hover:text-[#007AFF]"
                            title="Düzenle"
                          >
                            <Edit2 className="w-4 h-4 text-[#007AFF]" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(row)}
                            className="w-8 h-8 rounded-lg text-[#86868B] hover:text-[#FF3B30] hover:bg-red-50"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4 text-[#FF3B30]" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center text-sm text-[#86868B]">
                  Sonuç bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 select-none">
          <span className="text-xs text-[#86868B]">
            Toplam {filteredData.length} kayıttan {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredData.length)} arası gösteriliyor
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((c) => c - 1)}
              className="w-8 h-8 rounded-lg border-[#D1D1D6]"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-semibold text-[#1D1D1F] px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((c) => c + 1)}
              className="w-8 h-8 rounded-lg border-[#D1D1D6]"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
