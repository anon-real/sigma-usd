import React from 'react';
import { Wallet } from '../interface';

import { ReactComponent as NautilusLogo } from '../../../assets/components/icons/nautilus-logo-icon.svg';

export const Nautilus: Wallet = {
    name: 'Nautilus Wallet',
    icon: <NautilusLogo />,
    extensionLink:
        'https://chrome.google.com/webstore/detail/nautilus-wallet/gjlmehlldlphhljhpnlddaodbjjcchai',
};
