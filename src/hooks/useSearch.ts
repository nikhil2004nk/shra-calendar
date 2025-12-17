import { useMemo, useState } from "react";
import type { CalendarItem } from "../utils/types";
import { filterByQuery } from "../utils/filterUtils";

export const useSearch = (items: CalendarItem[]) => {
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => filterByQuery(items, query),
    [items, query]
  );

  return { query, setQuery, results };
};
