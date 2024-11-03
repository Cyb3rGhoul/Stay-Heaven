import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function PieActiveArc({ data }) {
    const [width, setWidth] = React.useState(window.innerWidth);
    const [bottom, setBottom] = React.useState(50);
    React.useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);

        if (width < 500) setBottom(90);
        else if (width < 800) setBottom(60);
        else setBottom(90);
        return () => window.removeEventListener("resize", handleResize);
    }, [width]);
    return (
        <PieChart
            margin={{ top: 0, bottom: bottom, left: 0, right: 0 }}
            series={[
                {
                    data,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "gray",
                    },
                },
            ]}
            height={300}
            slotProps={{
                legend: {
                    direction: "row",
                    position: { vertical: "bottom", horizontal: "center" },
                    padding: 0,
                },
            }}
        />
    );
}
