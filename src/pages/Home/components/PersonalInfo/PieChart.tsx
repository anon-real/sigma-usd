import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface IPieChartProps {
    data: any;
    labels?: any;
    compact?: boolean;
}
export enum COLORSIDS {
    REBELCASH = 'RebelCash',
    REBELSHARE = 'RebelShare',
    ERGO = 'Ergo',
}
export const COLORS = {
    [COLORSIDS.REBELCASH]: '#2F5EF6',
    [COLORSIDS.REBELSHARE]: '#610BFC',
    [COLORSIDS.ERGO]: '#ffffff',
};

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.01;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="chart__text"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
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
            return <div className="empty-chart">You don’t have any assets right now</div>;
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
                            outerRadius={90}
                            fill="#8884d8"
                            dataKey="value"
                            blendStroke
                            label={renderCustomizedLabel}
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
