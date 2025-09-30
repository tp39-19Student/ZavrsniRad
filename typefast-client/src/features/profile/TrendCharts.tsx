import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getProfileStatsStart } from "./profileSlice";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


export default function TrendCharts({id} : {id: number}) {
    const dispatch = useAppDispatch();

    const dailyStats = useAppSelector(state => state.profile.dailyStats);
    const monthlyStats = useAppSelector(state => state.profile.monthlyStats);

    useEffect(() => {
        dispatch(getProfileStatsStart(id));
    }, [dispatch, id])

    const dailyMapped = dailyStats.map((s, i) => {
        return ({
            wpm: s.wpm,
            accuracy: s.accuracy,
            xLabel: (i == dailyStats.length - 1)?"o":s.datePlayed.split("-")[2],
            tooltipLabel: formatDate(s.datePlayed, "daily")
        });
    });

    const monthlyMapped = monthlyStats.map((s, i) => {
        return ({
            wpm: s.wpm,
            accuracy: s.accuracy,
            xLabel: (i == monthlyStats.length - 1)?"o":monthName(s.datePlayed.split("-")[1]),
            tooltipLabel: formatDate(s.datePlayed, "monthly")
        });
    })

    const CustomTooltip = ({active, payload}: {active: boolean, payload: any[]}, metric: "wpm"|"accuracy") => {
        const isVisible = active && payload && payload.length;
        return (
            <div style={{visibility: isVisible? "visible": "hidden"}}>
                {isVisible && <>
                    <p>{payload[0].payload["tooltipLabel"]}: {" "}
                        {metric == "wpm" && (payload[0].payload["wpm"].toFixed(2) + " Wpm")}
                        {metric == "accuracy" && ((payload[0].payload["accuracy"] * 100).toFixed(2)) + "%"}
                    </p>
                </>}
            </div>
        );
    }

    return (
        <div id="charts">
            <div className="group">
                <h1>Daily Stats (past 30 days)</h1>
                <div style={{display: "flex"}}>
                    <ResponsiveContainer width="50%" height={300}>
                        <LineChart
                            width={600}
                            height={300}
                            data={dailyMapped}
                            margin={{right: 20}}
                            >
                            <Line isAnimationActive={false} dataKey={"wpm"} strokeWidth={3} stroke="#7ab3d8ff" dot={false} />
                            <XAxis stroke="white" dataKey={"xLabel"} />
                            <YAxis stroke="white" />
                            <CartesianGrid strokeWidth={0.5} />
                            <Tooltip content={(t) => CustomTooltip(t, "wpm")} />
                            <Legend align="right" />
                        </LineChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="50%" height={300}>
                        <LineChart
                            width={600}
                            height={300}
                            data={dailyMapped}
                            margin={{right: 20}}
                            >
                            <Line isAnimationActive={false} dataKey={"accuracy"} strokeWidth={3} stroke="#ef5e5eff" dot={false} />
                            <XAxis stroke="white" dataKey={"xLabel"} />
                            <YAxis stroke="white" domain={[0, 1]} />
                            <CartesianGrid strokeWidth={0.5} />
                            <Tooltip content={(t) => CustomTooltip(t, "accuracy")} />
                            <Legend align="right" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <hr />
            <div className="group">
                <h1>Monthly Stats (past 12 months)</h1>
                <div style={{display: "flex"}}>
                    <ResponsiveContainer width="50%" height={300}>
                        <LineChart
                            width={600}
                            height={300}
                            data={monthlyMapped}
                            margin={{right: 20}}
                            >
                            <Line isAnimationActive={false} dataKey={"wpm"} strokeWidth={3} stroke="#7ab3d8ff" dot={false} />
                            <XAxis stroke="white" dataKey={"xLabel"} />
                            <YAxis stroke="white" />
                            <CartesianGrid strokeWidth={0.5} />
                            <Tooltip content={(t) => CustomTooltip(t, "wpm")} />
                            <Legend align="right" />
                        </LineChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="50%" height={300}>
                        <LineChart
                            width={600}
                            height={300}
                            data={monthlyMapped}
                            margin={{right: 20}}
                            >
                            <Line isAnimationActive={false} dataKey={"accuracy"} strokeWidth={3} stroke="#ef5e5eff" dot={false} />
                            <XAxis stroke="white" dataKey={"xLabel"} />
                            <YAxis stroke="white" domain={[0, 1]} />
                            <CartesianGrid strokeWidth={0.5} />
                            <Tooltip content={(t) => CustomTooltip(t, "accuracy")} />
                            <Legend align="right" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    function formatDate(date: string, type: "daily" | "monthly") {
        const t = date.split("-");
        if (type == "daily") {
            return t[2] + " " + monthName(t[1]);
        } else if (type == "monthly") {
            return monthName(t[1]) + " " + t[0];
        } else return date;
    }

    function monthName(month: string) {
        switch(month) {
            case "01": return "Jan";
            case "02": return "Feb";
            case "03": return "Mar";
            case "04": return "Apr";
            case "05": return "May";
            case "06": return "Jun";
            case "07": return "Jul";
            case "08": return "Aug";
            case "09": return "Sep";
            case "10": return "Oct";
            case "11": return "Nov";
            case "12": return "Dec";
            default: return month;
        }
    }
}