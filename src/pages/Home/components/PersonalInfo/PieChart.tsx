import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Trans } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';


type DataItem = {
    name: string;
    key: COLORSIDS;
    value: number | undefined;
};
interface IPieChartProps {
    data: DataItem[];
    labels?: unknown;
    compact?: boolean;
}
export enum COLORSIDS {
    SIGMAUSD = 'SigmaUSD',
    SIGMARSV = 'SigmaRSV',
    ERGO = 'Ergo',
}
export const COLORS = {
    [COLORSIDS.SIGMAUSD]: '#2F5EF6',
    [COLORSIDS.SIGMARSV]: '#0bfcae',
    [COLORSIDS.ERGO]: '#ffffff',
};

export class PieChartComponent extends React.PureComponent<IPieChartProps> {
    // eslint-disable-next-line react/state-in-constructor
    state = {
        activeIndex: 0,
    };

    render(): JSX.Element {
        const { data } = this.props;

        if (data.every(({ value }) => !value)) {
            return (
                <div className="empty-chart">
                   {data.every(({ value }) => value === 0) ? <Trans i18nKey="noAssets"/> : <Skeleton width={40} />}
                </div>
            );
        }
        const filteredData = data.filter(({ value }) => value !== 0);

        return (
            <div className="chart">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            activeIndex={this.state.activeIndex}
                            data={filteredData}
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            blendStroke
                            label={false}
                            labelLine={false}
                        >
                            {filteredData.map((entry) => (
                                <Cell
                                    key={`cell-${entry.value}`}
                                    fill={COLORS[entry.key]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

export default PieChartComponent;
