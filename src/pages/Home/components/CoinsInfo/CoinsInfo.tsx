import React, { Component } from 'react';
import { reserveAcronym, reserveName, usdAcronym } from 'utils/consts';
import { rcNumCirc, rcPrice, scNumCirc, scPrice } from '../../../../utils/ageHelper';
import { numberWithCommas } from '../../../../utils/serializer';

export class CoinsInfo extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            scPrice: NaN,
            rcPrice: NaN,
            scCirc: NaN,
            rcCirc: NaN,
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
                        <div className="coin-prop__title">Current price</div>

                        <div className="coin-prop__value">
                            ERG {this.state.scPrice}
                            <span className="tooltip">
                                <div className="tooltip__pin">?</div>
                                <div className="tooltip__popup">
                                    This value indicates how
                                    <br />
                                    much ERG is in 1 {usdAcronym}.
                                    <br />
                                    <span>ERG 1 ≈ {(1 / this.state.scPrice).toFixed(5)} {usdAcronym}</span>
                                </div>
                            </span>
                        </div>
                    </div>

                    <div className="coin-prop">
                        <div className="coin-prop__title">Circulating Supply</div>
                        <div className="coin-prop__value">
                            {numberWithCommas(this.state.scCirc)}
                        </div>
                    </div>
                </div>

                <div className="coin-info tiles">
                    <div className="coin-info__title">{reserveAcronym}</div>

                    <div className="coin-prop">
                        <div className="coin-prop__title">Current price</div>

                        <div className="coin-prop__value">
                            ERG {this.state.rcPrice}
                            <span className="tooltip">
                                <div className="tooltip__pin">?</div>
                                <div className="tooltip__popup">
                                    This value indicates how
                                    <br />
                                    much ERG is in 1 {reserveAcronym}.
                                    <br />
                                    <span>ERG 1 ≈ {(1 / this.state.rcPrice).toFixed(0)} {reserveAcronym}</span>
                                </div>
                            </span>
                        </div>
                    </div>

                    <div className="coin-prop">
                        <div className="coin-prop__title">Circulating Supply</div>

                        <div className="coin-prop__value">
                            {numberWithCommas(this.state.rcCirc)}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default CoinsInfo;
