import React, { Component } from 'react';
import cn from 'classnames';
import moment from 'moment';
import PieChartComponent, { COLORS, COLORSIDS } from './PieChart';
import { reserveAcronym, usdAcronym } from '../../../../utils/consts';
import { getForKey } from '../../../../utils/helpers';

interface Props {
    ergVal?: number;
    reserveVal?: number;
    stableVal?: number;
}

interface HistoryItem {
    id: number;
    name: string;
    from: string;
    date: string;
    action: string;
    link: string;
}

interface State {
    ergVal?: number;
    reserveVal?: number;
    stableVal?: number;
    history: HistoryItem[];
    intervalId: any;
}

export class PersonalInfo extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            history: [],
            ergVal: NaN,
            reserveVal: NaN,
            stableVal: NaN,
            intervalId: null,
        };
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (
            nextProps.ergVal !== prevState.ergVal ||
            nextProps.reserveVal !== prevState.reserveVal ||
            nextProps.stableVal !== prevState.stableVal
        ) {
            return {
                ergVal: nextProps.ergVal,
                reserveVal: nextProps.reserveVal,
                stableVal: nextProps.stableVal,
            };
        }
        return null;
    }

    componentDidMount() {
        this.updateHistory();
        const intervalId = setInterval(() => this.updateHistory(), 5000);
        this.setState({
            intervalId,
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    getHistoryElems() {
        return this.state.history.map((item: any) => {
            return (
                <a
                    key={item.id}
                    className={cn(`history-item`, {
                        success: item.status === 'success',
                        fail: item.status === 'fail',
                    })}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div className="history-item__title">
                        <div className="transaction-left-side">
                            <span className="transaction-name">
                                {item.name}
                            </span>
                            <span
                                className={cn('transaction-badge', {
                                    pending: item.miningStat === 'pending',
                                    mined: item.miningStat === 'mined',
                                })}
                            >
                                {item.miningStat}
                            </span>
                        </div>
                        <span className="transaction-date">
                            <span>{item.from}</span> | {item.date}
                        </span>
                    </div>

                    <div className="history-item__divider" />

                    <div className="history-item__info">{item.action}</div>
                </a>
            );
        });
    }

    async updateHistory() {
        const raw = getForKey('operation').sort(
            (a: any, b: any) => b.timestamp - a.timestamp
        );
        this.setState({
            history: raw.map((col: any, index: number) => {
                const time = moment(col.timestamp);
                return {
                    id: index + 1,
                    name: col.type,
                    from: time.format('dddd').slice(0, 2),
                    date: time.format('l'),
                    action: `${col.get} | (${col.pay})`,
                    status: col.status,
                    miningStat: col.miningStat,
                    link: `https://explorer.ergoplatform.com/en/transactions/${col.txId}`,
                };
            }),
        });
    }

    render() {
        const chartData = [
            {
                name: usdAcronym,
                key: 'SigmaUSD',
                value: this.state.stableVal,
            },
            {
                name: reserveAcronym,
                key: 'SigmaRSV',
                value: this.state.reserveVal,
            },
            {
                name: 'ERG',
                key: 'Ergo',
                value: this.state.ergVal,
            },
        ];

        return (
            <section className="personal-info">
                <div className="balance tiles">
                    <div className="balance__title">Your balance</div>

                    <div className="balance__info">
                        <PieChartComponent data={chartData} />
                        <div className="balance__coins">
                            {chartData.map(({ name, key, value }) => (
                                <div className="balance__coin" key={name}>
                                    <span
                                        className="coin-title"
                                        style={{
                                            color: COLORS[key as COLORSIDS],
                                        }}
                                    >
                                        {name}
                                    </span>
                                    <span className="coin-value">
                                        ${value?.toFixed(3)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mint-history tiles">
                    <div className="mint-history__title">History</div>

                    {!!this.state.history.length && (
                        <div className="mint-history__description">
                            If a operation succeeds, it will be highlighted in
                            green. Otherwise, it will be highlighted in red and
                            it means that your funds are being returned to you.
                        </div>
                    )}
                    {!!this.state.history.length && (
                        <div className="history-list">
                            {this.getHistoryElems()}
                        </div>
                    )}
                    {!this.state.history.length && (
                        <div className="history-empty">No history yet</div>
                    )}
                </div>
            </section>
        );
    }
}

export default PersonalInfo;
