import { HTMLAttributes, ReactNode } from 'react';
export { fadeIn, containerVar, itemVar } from '../Shared/variants';

export const SectionTitle = ({ children, id, ...rest }: { children: ReactNode; id?: string } & HTMLAttributes<HTMLHeadingElement>) => (
  <h2 id={id} className="text-3xl font-bold mb-6" {...rest}>
    {children}
  </h2>
);
