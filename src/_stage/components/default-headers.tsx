// src/_stage/components/default-headers.tsx
import { JSX } from 'preact';

export interface DefaultAppHeadersProps {
  children?: JSX.Element[];
}

export const DefaultHeaders = ({ children }: DefaultAppHeadersProps) => (
  <>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/public/favicon/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="/public/dist/styles.css" />
    <link href="/public/prism/styles.css" rel="stylesheet" />
    <script src="/public/prism/index.js"></script>
    {children}
    <script src="/public/cond8-dev.js"></script>
    <script src="https://unpkg.com/htmx.org@2.0.4"></script>
  </>
);
