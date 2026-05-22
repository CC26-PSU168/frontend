declare module 'next/link' {
  import type { AnchorHTMLAttributes, ReactNode } from 'react';
  
  interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    href: string | { pathname?: string; query?: Record<string, any> };
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean | null;
    locale?: string;
    children?: ReactNode;
  }
  
  export default function Link(props: LinkProps): JSX.Element;
}

declare module 'next/navigation' {
  import type { ReactNode } from 'react';
  
  export interface NavigateOptions {
    scroll?: boolean;
  }
  
  export function useRouter(): {
    push: (href: string, options?: NavigateOptions) => void;
    replace: (href: string, options?: NavigateOptions) => void;
    refresh: () => void;
    back: () => void;
    forward: () => void;
    prefetch: (href: string) => void;
  };
  
  export function usePathname(): string;
  
  export function useSearchParams(): URLSearchParams;
  
  export function useParams(): Record<string, string | string[]>;
  
  export function redirect(url: string): never;
  
  export function notFound(): never;
}
