import React, { useEffect, useRef } from 'react';
import { cn } from '~/utils';

export type CheckboxState = boolean | 'indeterminate';

export type UICheckboxProps = {
  checked: CheckboxState;
  onCheckedChange?: (checked: CheckboxState) => void;
  className?: string;
  'aria-label'?: string;
};

export const Checkbox: React.FC<UICheckboxProps> = ({ checked, onCheckedChange, className, ...rest }) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = checked === 'indeterminate';
    }
  }, [checked]);

  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn('h-4 w-4 cursor-pointer', className)}
      checked={checked === true}
      onChange={(e) => onCheckedChange?.(e.currentTarget.indeterminate ? 'indeterminate' : e.currentTarget.checked)}
      {...rest}
    />
  );
};

export default Checkbox;
