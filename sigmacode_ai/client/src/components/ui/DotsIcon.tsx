import React from 'react';
import { MoreHorizontal } from 'lucide-react';

type DotsIconProps = React.ComponentProps<typeof MoreHorizontal>;

export const DotsIcon: React.FC<DotsIconProps> = (props) => {
  return <MoreHorizontal {...props} />;
};

export default DotsIcon;
