/** Shared Tailwind class fragments */

export const cx = (...parts) => parts.filter(Boolean).join(' ');

const btnBase =
  'inline-flex items-center justify-center gap-1.5 rounded-md border font-medium shadow-sm transition-colors disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap';

export const btn = {
  primary: cx(
    btnBase,
    'border-blue-600 bg-blue-600 px-3.5 py-2 text-sm text-white hover:border-blue-700 hover:bg-blue-700',
  ),
  primarySm: cx(
    btnBase,
    'border-blue-600 bg-blue-600 px-2.5 py-1 text-xs text-white hover:border-blue-700 hover:bg-blue-700',
  ),
  secondary: cx(
    btnBase,
    'border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 hover:bg-gray-50',
  ),
  secondarySm: cx(
    btnBase,
    'border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-900 hover:bg-gray-50',
  ),
  dangerSm: cx(
    btnBase,
    'border-red-600 bg-red-600 px-2.5 py-1 text-xs text-white hover:border-red-700 hover:bg-red-700',
  ),
  ghost: cx(
    btnBase,
    'border-transparent bg-transparent px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-none',
  ),
  ghostSm: cx(
    btnBase,
    'border-transparent bg-transparent px-1.5 py-0.5 text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-none',
  ),
};

export const form = {
  stack: 'flex flex-col gap-4',
  field: 'flex flex-col gap-1',
  label: 'text-sm font-medium text-gray-900',
  control:
    'w-full rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600',
  textarea:
    'min-h-[80px] w-full resize-y rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-blue-600 focus:ring-1 focus:ring-blue-600',
  actions: 'flex justify-end gap-2 pt-1',
  error: 'text-xs font-medium text-red-600',
  hint: 'text-xs text-gray-500',
};
