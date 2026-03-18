"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, startTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { activities } from "@/components/Stats/utils";

const SEARCH_DEBOUNCE_MS = 300;

export default function SearchAndFilter({
  search: initialSearch = "",
  sport: initialSport = "",
}: {
  search?: string;
  sport?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [sportValue, setSportValue] = useState(initialSport || "all");

  useEffect(() => {
    setSearchInput(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setSportValue(initialSport || "all");
  }, [initialSport]);

  const setFilters = useCallback(
    (updates: { search?: string; sport?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (updates.search !== undefined) {
        if (updates.search) params.set("search", updates.search);
        else params.delete("search");
      }
      if (updates.sport !== undefined) {
        if (updates.sport) params.set("sport", updates.sport);
        else params.delete("sport");
      }
      const q = params.toString();
      const url = q ? `${pathname}?${q}` : pathname;
      startTransition(() => {
        router.push(url);
        setTimeout(() => router.refresh(), 0);
      });
    },
    [router, pathname, searchParams]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters({ search: searchInput });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput, setFilters]);

  const handleSportChange = (value: string) => {
    setSportValue(value);
    setFilters({ sport: value === "all" ? "" : value });
  };

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center bg-white/10 p-2 rounded-md text-black items-center justify-center">
      <Input
        type="search"
        placeholder="Search by event name..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="sm:max-w-xs bg-white text-xs sm:text-md"
        aria-label="Search events by name"
      />
      <Select
        value={sportValue}
        onValueChange={handleSportChange}
      >
        <SelectTrigger className="w-full sm:w-[180px] bg-white" aria-label="Filter by sport">
          <SelectValue placeholder="All sports" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sports</SelectItem>
          {activities.map((a) => (
            <SelectItem key={a} value={a}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
