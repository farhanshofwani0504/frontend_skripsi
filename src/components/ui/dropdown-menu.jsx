import * as React from "react";
import * as RM from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";

export function DropdownMenu({ children, ...props }) {
  return <RM.Root {...props}>{children}</RM.Root>;
}
export const DropdownMenuTrigger = RM.Trigger;
export const DropdownMenuGroup = RM.Group;
export const DropdownMenuPortal = RM.Portal;

export function DropdownMenuContent({ className, ...props }) {
  return (
    <RM.Portal>
      <RM.Content
        sideOffset={4}
        className={clsx(
          "z-50 min-w-[150px] overflow-hidden rounded-md border bg-white " +
            "p-1 text-sm shadow-md animate-in fade-in-0 zoom-in-95 " +
            "data-[side=bottom]:slide-in-from-top-2",
          className
        )}
        {...props}
      />
    </RM.Portal>
  );
}

export function DropdownMenuItem({ className, ...props }) {
  return (
    <RM.Item
      className={clsx(
        "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 " +
          "outline-none transition-colors focus:bg-slate-100",
        className
      )}
      {...props}
    />
  );
}

export const DropdownMenuSeparator = (props) => (
  <RM.Separator className="my-1 h-px bg-slate-100" {...props} />
);
