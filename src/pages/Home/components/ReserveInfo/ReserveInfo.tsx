import css from './ReserveInfo.module.scss'

import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';

import { useIntervalState } from 'hooks/useIntervalState';
import { baseReserves, currentReserveRatio, scPrice } from 'utils/ageHelper';
import { ergCoin, NanoErgInErg, usdAcronym } from 'utils/consts';
import { numberWithCommas } from 'utils/serializer';
import { getCirculatingSupply } from 'utils/explorer';

const updateDelay = 1000 * 30

export const ReserveInfo = () => {

    const reserves = useIntervalState(() => {
        return baseReserves().then((res: bigint) => Number(res / NanoErgInErg));
    }, updateDelay);

    const ratio = useIntervalState(currentReserveRatio, updateDelay);

    const supply = useIntervalState(() => {
        return getCirculatingSupply().then((s: number) => s / Number(NanoErgInErg));
    }, updateDelay);

    const [percent, setPercent] = useState<number | undefined>();

    useEffect(() => {
        if (reserves && supply) {
            setPercent(100 * reserves / supply)
        }
    }, [reserves, supply])

    const usdPrice = useIntervalState(() => scPrice().then(p => 1 / p * 1e7), updateDelay);

    return (
        <section className={cn('coins-info', css.root)}>
            <div className="coin-info tiles">
                <div className="coin-info__title"><Trans i18nKey="reserves" /></div>
                <div className={css.content}>
                    <div className="coin-prop-footer">
                        <div className="coin-prop-right">
                            <div className="coin-prop__title"><Trans i18nKey="reserveRatio" /></div>
                            <div className="coin-prop-right__value">
                                <span>{ratio || <Skeleton width={64} />}%</span>
                            </div>
                        </div></div>
                    <div className="coin-prop-footer">

                        <div className="coin-prop-right">
                            <div className="coin-prop__title"><Trans i18nKey="baseReserves" /></div>
                            <div className="coin-prop-right__value">
                                <div>
                                    {reserves ? numberWithCommas(reserves) : <Skeleton width={200} />} {ergCoin}
                                    {' '}<span className={css.percent}>({percent?.toFixed(1) ?? <Skeleton width={64} />}%)</span>
                                    {percent && supply && (
                                        <span className="tooltip">
                                            <div className="tooltip__pin">?</div>
                                            <div className="tooltip__popup">
                                                <Trans i18nKey="baseReservesTooltip"
                                                    values={{
                                                        'percent': percent.toFixed(1),
                                                        'supply': numberWithCommas(supply),
                                                        'ergCoin': ergCoin
                                                    }}
                                                />
                                            </div>
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <span className={css.usd}>
                                        ≈ {reserves && usdPrice ?
                                            `${numberWithCommas((reserves * usdPrice / 1000000).toFixed(2))}M` :
                                            <Skeleton width={64} />} {usdAcronym}
                                    </span>
                                    {reserves && usdPrice && (
                                        <span className="tooltip">
                                            <div className="tooltip__pin">?</div>
                                            <div className="tooltip__popup">
                                                <Trans i18nKey="baseReservesUsdTooltip"
                                                    values={{
                                                        'value': numberWithCommas((reserves * usdPrice).toFixed(0)),
                                                        'usdAcronym': usdAcronym
                                                    }}
                                                />
                                            </div>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


