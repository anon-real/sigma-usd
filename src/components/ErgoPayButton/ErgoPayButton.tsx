import React from 'react';
import qs from 'query-string';
import { reserveName, usdName, sigUsdTokenId, sigRsvTokenId } from 'utils/consts';

type Props = {};

const getMobileAppLink = ({ coin, address, amount }: any) => {
    switch (coin) {
        case usdName: {
            return `ergo:${address}?${qs.stringify({
                amount: '0.002',
                [`token-${sigUsdTokenId}`]: amount,
            })}`;
        }
        case reserveName: {
            return `ergo:${address}?${qs.stringify({
                amount: '0.002',
                [`token-${sigRsvTokenId}`]: amount,
            })}`;
        }
        default: {
            return `ergo:${address}?${qs.stringify({
                amount,
            })}`;
        }
    }
};

const ErgoPayButton = ({ address, amount, coin }: any) => {
    const mobileAppLink = getMobileAppLink({ coin, address, amount });

    return <a href={mobileAppLink}>Click here to open wallet app</a>;
};

export default ErgoPayButton;
