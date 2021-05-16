import React, { Component } from 'react';
import { reserveAcronym, usdAcronym } from 'utils/consts';
import { currentReserveRatio, rcNumCirc, rcPrice, scNumCirc, scPrice } from '../../../../utils/ageHelper';
import { numberWithCommas } from '../../../../utils/serializer';
import { withTranslation, Trans } from 'react-i18next';

export class CoinsInfo extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            scPrice: NaN,
            rcPrice: NaN,
            scCirc: NaN,
            rcCirc: NaN,
            reserveRatio: NaN,
        };
    }

    async updateParams() {
        const sc = await scPrice();
        const rc = await rcPrice();
        const scCirc = await scNumCirc();
        const rcCirc = await rcNumCirc();
        this.setState({
            scPrice: (sc / 1e7).toFixed(8),
            rcPrice: (rc / 1e9).toFixed(8),
            scCirc: (scCirc / 100).toFixed(2),
            reserveRatio: currentReserveRatio(),
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
                            ERG {this.state.scPrice}
                            <span className="tooltip">
                                <div className="tooltip__pin">?</div>
                                <div className="tooltip__popup">
                                    <Trans i18nKey="stableHelp"
                                           values={{ 'usdAcronym': usdAcronym, 'ratio': (1 / this.state.scPrice).toFixed(5) }}
                                           components={{ span: <span /> }}
                                    />
                                </div>
                            </span>
                        </div>
                    </div>

                    <div className="coin-prop">
                        <div className="coin-prop__title"><Trans i18nKey='circulatingSupply' /></div>
                        <div className="coin-prop__value">
                            {numberWithCommas(this.state.scCirc)}
                        </div>
                    </div>

                    <div className="coin-prop-footer">
                        <div className="coin-prop-right">
                            <div className="coin-prop__title"><Trans i18nKey='currentRatio' /></div>
                            <div className="coin-prop-right__value">
                                <span>
                                    1 ERG ≈ {(1 / this.state.scPrice).toFixed(2)} {usdAcronym}
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
                            ERG {this.state.rcPrice}
                            <span className="tooltip">
                                <div className="tooltip__pin">?</div>
                                <div className="tooltip__popup">
                                    <Trans i18nKey='reserveHelp'
                                           values={{ 'reserveAcronym': reserveAcronym, 'ratio': (1 / this.state.rcPrice).toFixed(0) }}
                                           components={{ span: <span /> }}
                                    />
                                </div>
                            </span>
                        </div>
                    </div>

                    <div className="coin-prop">
                        <div className="coin-prop__title"><Trans i18nKey='circulatingSupply' /></div>

                        <div className="coin-prop__value">
                            {numberWithCommas(this.state.rcCirc)}
                        </div>
                    </div>

                    <div className="coin-prop-footer">
                        <div className="coin-prop-right">
                            <div className="coin-prop__title"><Trans i18nKey='currentRatio' /></div>
                            <div className="coin-prop-right__value">
                                <span>
                                    1 ERG ≈ {(1 / this.state.rcPrice).toFixed(0)} {reserveAcronym}
                                </span>
                            </div>
                        </div>

                        <div className="coin-prop-right">
                            <div className="coin-prop-right__title"><Trans i18nKey="reserveRatio" /></div>
                            <div className="coin-prop-right__value">
                                <span>{this.state.reserveRatio}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default withTranslation()(CoinsInfo);
