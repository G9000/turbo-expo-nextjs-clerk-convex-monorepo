import { useState } from "react";

interface Entry {
  id: number;
  name: string;
  total: number;
  currency: string;
  category: string;
  date: string;
  dateTo?: string;
  isPlanned?: boolean;
}

export function useExpenseForm(baseCurrency: string) {
  const [name, setName] = useState("");
  const [total, setTotal] = useState("");
  const [currency, setCurrency] = useState(baseCurrency);
  const [category, setCategory] = useState("other");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dateTo, setDateTo] = useState("");
  const [isPlanned, setIsPlanned] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<number | null>(null);

  const resetForm = () => {
    setName("");
    setTotal("");
    setCurrency(baseCurrency);
    setCategory("other");
    setDate(new Date().toISOString().split("T")[0]);
    setDateTo("");
    setIsPlanned(false);
    setEditingEntry(null);
    setIsDialogOpen(false);
  };

  const loadEntryForEdit = (entry: Entry) => {
    setName(entry.name);
    setTotal(entry.total.toString());
    setCurrency(entry.currency);
    setCategory(entry.category);
    setDate(entry.date);
    setDateTo(entry.dateTo || "");
    setIsPlanned(entry.isPlanned || false);
    setEditingEntry(entry.id);
    setIsDialogOpen(true);
  };

  const createEntryData = () => {
    return {
      id: editingEntry || Date.now(),
      name,
      total: parseFloat(total),
      currency,
      category,
      date,
      ...((category === "hotel" || category === "flight") && dateTo
        ? { dateTo }
        : {}),
      isPlanned,
    };
  };

  return {
    // State
    name,
    total,
    currency,
    category,
    date,
    dateTo,
    isPlanned,
    showCustomCategory,
    customCategoryInput,
    isDialogOpen,
    editingEntry,
    // Setters
    setName,
    setTotal,
    setCurrency,
    setCategory,
    setDate,
    setDateTo,
    setIsPlanned,
    setShowCustomCategory,
    setCustomCategoryInput,
    setIsDialogOpen,
    // Methods
    resetForm,
    loadEntryForEdit,
    createEntryData,
  };
}
