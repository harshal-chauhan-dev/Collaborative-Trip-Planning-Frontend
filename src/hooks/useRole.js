import { useOutletContext } from 'react-router-dom';

const ROLE_RANK = { viewer: 1, editor: 2, owner: 3 };

export const useRole = () => {
  const { role } = useOutletContext();

  const can = (minRole) => {
    return (ROLE_RANK[role] ?? 0) >= (ROLE_RANK[minRole] ?? Infinity);
  };

  return { role, can };
};
