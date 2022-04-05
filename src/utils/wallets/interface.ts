import { ReactNode } from 'react';

export interface Wallet {
    readonly name: string;
    readonly icon: ReactNode;
    readonly extensionLink: string;
}
