"use client";

import * as React from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

export type SelectItemOption = { id: string; name: string };

export interface SelectItemServerVariant1Props {
  /**
   * Currently selected item ID
   */
  valueItemId: string | null | undefined;
  /**
   * Callback when selection changes
   */
  onChange: (itemId: string | null) => void;
  /**
   * Function to fetch options from server
   * Should return array of {id: string, name: string}
   */
  fetchOptions: () => Promise<SelectItemOption[]>;
  /**
   * Label for the select field
   */
  label?: string;
  /**
   * Helper text below the field
   */
  helperText?: string;
  /**
   * Disable the field
   */
  disabled?: boolean;
}

/**
 * Generic server-fetched autocomplete select component
 * Fetches options from a provided async function and displays in an autocomplete
 */
export default function SelectItemServerVariant1({
  valueItemId,
  onChange,
  fetchOptions,
  label = "Select Item",
  helperText,
  disabled,
}: SelectItemServerVariant1Props) {
  const [options, setOptions] = React.useState<SelectItemOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState<SelectItemOption | null>(null);

  const findById = React.useCallback(
    (id?: string | null) => options.find((o) => o.id === id) || null,
    [options]
  );

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const items = await fetchOptions();
        if (!active) return;
        setOptions(items);
        setValue(items.find((o) => o.id === valueItemId) || null);
      } catch (e) {
        console.error("Failed to fetch options:", e);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [fetchOptions, valueItemId]);

  React.useEffect(() => {
    setValue(findById(valueItemId));
  }, [valueItemId, findById]);

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(o) => o.name}
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue as SelectItemOption | null);
        onChange(newValue ? (newValue as SelectItemOption).id : null);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={16} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      disabled={disabled}
      isOptionEqualToValue={(opt, val) => opt.id === (val?.id || "")}
      clearOnBlur={false}
    />
  );
}
