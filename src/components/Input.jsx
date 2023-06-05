import { forwardRef } from "react";

export const Input = forwardRef(({ className, ...rest }, ref) => {
  return <input {...rest} ref={ref} />;
});
