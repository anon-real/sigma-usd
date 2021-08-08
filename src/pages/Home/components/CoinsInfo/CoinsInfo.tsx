import React, { Component } from 'react';
import { reserveAcronym, usdAcronym } from 'utils/consts';
import Skeleton from 'react-loading-skeleton';

import { rcNumCirc, rcPrice, scNumCirc, scPrice } from '../../../../utils/ageHelper';
import { numberWithCommas } from '../../../../utils/serializer';
import { withTranslation, Trans } from 'react-i18next';

type CoinsInfoProps = {};

type CoinsInfoState = {
    scPrice?: number,
    scPriceFormatted?: string,
    rcPrice?: number,
    rcPriceFormatted?: string;
    scCirc?: string,
    rcCirc?: number,
};

export class CoinsInfo extends Component<CoinsInfoProps, CoinsInfoState> {
    constructor(props: CoinsInfoProps) {
        super(props);
        this.state = {};
    }

    async updateParams() {
        const sc = (await scPrice()) / 1e7;
        const rc = (await rcPrice()) / 1e9;
        const scCirc = (await scNumCirc()) / 100;
        const rcCirc = await rcNumCirc();
        this.setState({
            scPrice: sc,
            scPriceFormatted: sc.toFixed(8),
            rcPrice: rc,
            rcPriceFormatted: rc.toFixed(8),
            scCirc: scCirc.toFixed(2),
            rcCirc,
        });
    }

    componentDidMount() {
        this.updateParams();
        setInterval(() => {
            this.updateParams();
        }, 10000);
    }

    render() {
        return (
            <section className="coins-info">
                <div className="coin-info tiles">
                    <div className="coin-info__title">{usdAcronym}</div>

                    <div className="coin-prop">
                        <div className="coin-prop__title"><Trans i18nKey='currentPrice' /></div>

                        <div className="coin-prop__value">
                            ERG {this.state.scPriceFormatted || <Skeleton />}
                            {this.state.scPrice && <span className="tooltip">
                                <div className="tooltip__pin">?</div>
                                <div className="tooltip__popup">
                                    <Trans i18nKey="stableHelp"
                                        values={{ 'usdAcronym': usdAcronym, 'ratio': (1 / this.state.scPrice).toFixed(5) }}
                                        components={{ span: <span /> }}
                                    />
                                </div>
                            </span>
                            }
                        </div>
                    </div>

                    <div className="coin-prop">
                        <div className="coin-prop__title"><Trans i18nKey='circulatingSupply' /></div>
                        <div className="coin-prop__value">
                            {this.state.scCirc && numberWithCommas(this.state.scCirc) || <Skeleton width={256} />}
                        </div>
                    </div>

                    <div className="coin-prop-footer">
                        <div className="coin-prop-right">
                            <div className="coin-prop__title"><Trans i18nKey='currentRatio' /></div>
                            <div className="coin-prop-right__value">
                                <span>
                                    1 ERG ≈ {this.state.scPrice && (1 / this.state.scPrice).toFixed(2) || <Skeleton width={32} />} {usdAcronym}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="coin-info tiles">
                    <div className="coin-info__title">{reserveAcronym}</div>

                    <div className="coin-prop">
                        <div className="coin-prop__title"><Trans i18nKey='currentPrice' /></div>

                        <div className="coin-prop__value">
                            ERG {this.state.rcPriceFormatted || <Skeleton />}
                            {this.state.rcPrice && <span className="tooltip">
                                <div className="tooltip__pin">?</div>
                                <div className="tooltip__popup">
                                    <Trans i18nKey='reserveHelp'
                                        values={{ 'reserveAcronym': reserveAcronym, 'ratio': (1 / this.state.rcPrice).toFixed(0) }}
                                        components={{ span: <span /> }}
                                    />
                                </div>
                            </span>}
                        </div>
                    </div>

                    <div className="coin-prop">
                        <div className="coin-prop__title"><Trans i18nKey='circulatingSupply' /></div>

                        <div className="coin-prop__value">
                            {this.state.rcCirc && numberWithCommas(this.state.rcCirc) || <Skeleton width={256} />}
                        </div>
                    </div>

                    <div className="coin-prop-footer">
                        <div className="coin-prop-right">
                            <div className="coin-prop__title"><Trans i18nKey='currentRatio' /></div>
                            <div className="coin-prop-right__value">
                                <span>
                                    1 ERG ≈ {this.state.rcPrice && (1 / this.state.rcPrice).toFixed(0) || <Skeleton width={32} />} {reserveAcronym}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        );
    }
}

export default withTranslation()(CoinsInfo);
