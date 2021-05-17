import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Trans } from 'react-i18next';

interface IPieChartProps {
    data: any;
    labels?: any;
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

    onPieEnter = (data: any, index: number) => {
        this.setState({
            activeIndex: index,
        });
    };

    render(): JSX.Element {
        const { data } = this.props;

        if (data.every(({ value }: any) => !value)) {
            return <div className="empty-chart"><Trans i18nKey="noAssets"/></div>;
        }
        const filteredData = data.filter(({ value }: any) => value !== 0);

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
                            {filteredData.map((entry: any) => (
                                <Cell
                                    key={`cell-${entry.value}`}
                                    fill={COLORS[entry.key as COLORSIDS]}
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
