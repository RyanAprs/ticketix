import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button/button";
import { Calendar } from "@/components/ui/Calendar/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover/popover";

export interface CustomDateInputProps {
  label?: string;
  error?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

const CustomDateInput = React.forwardRef<
  HTMLInputElement,
  CustomDateInputProps
>(
  (
    {
      label,
      error,
      value,
      onChange,
      containerClassName,
      labelClassName,
      inputClassName,
      errorClassName,
    },
    ref
  ) => {
    const [date, setDate] = React.useState<Date | undefined>(
      value || undefined
    );

    const handleDateChange = (date: Date | undefined) => {
      setDate(date);
      if (onChange) onChange(date ?? null);
    };

    return (
      <div
        className={cn(
          "w-full font-medium text-subtext md:text-lg",
          containerClassName
        )}
      >
        {label && (
          <label
            htmlFor="date-picker"
            className={cn("mb-2 block font-semibold", labelClassName)}
          >
            {label}
          </label>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal rounded-lg border bg-blue-200 p-4 placeholder-subtext/60",
                "focus:border-border focus:outline-none focus:ring-1 focus:ring-border",
                !date && "text-muted-foreground",
                inputClassName
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "PPP")
              ) : (
                <span className="text-subtext">Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              className={cn(
                "w-full rounded-lg border bg-blue-200 p-3 placeholder-subtext/60",
                "focus:border-border focus:outline-none focus:ring-1 focus:ring-border"
              )}
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {error && (
          <p className={cn("mt-2 font-semibold text-red-400", errorClassName)}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

CustomDateInput.displayName = "CustomDateInput";

export { CustomDateInput };
