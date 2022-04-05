import React from 'react';

import { ReactComponent as YoroiLogo } from '../../../assets/components/icons/yoroi-logo-icon.svg';
import { Wallet } from '../interface';

export const Yoroi: Wallet = {
    name: 'Yoroi Wallet',
    icon: <YoroiLogo />,
    extensionLink:
        'https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb',
};
