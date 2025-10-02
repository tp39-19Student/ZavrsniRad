import { Line, LineChart, YAxis, XAxis, Legend, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export interface GraphNode {
    time: number;
    wpm: number;
    accuracy: number;
};

export default function GameGraph({graphData}: {graphData: GraphNode[]} ) {


    return (
        <ResponsiveContainer width="90%" height={300} >
            <LineChart data={graphData} width={800} height={300} margin={{ top: 25, right: 25, bottom: 25, left: 25 }}>
                <Line isAnimationActive={false} dataKey="wpm" strokeWidth={3} stroke="#7ab3d8ff" dot={false} />
                <Line isAnimationActive={false} dataKey="accuracy" strokeWidth={3} stroke="#ef5e5eff" dot={false} />
                <YAxis stroke="white" padding={{top: 25}} />
                <XAxis stroke="white" dataKey="time" type="number" domain={[0,0]}/>
                <Legend align="right" />
                <CartesianGrid strokeWidth={0.5} />
                <Tooltip />
            </LineChart>
        </ResponsiveContainer>
    );
}