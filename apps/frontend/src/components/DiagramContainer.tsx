import COLORS from "../data/colors";

type DiagramContainerProps = {
    bulletPoints: { title: string; content: string; }[];
    children: React.ReactNode;
    svgLayout?: "horizontal" | "vertical";
    theme?: keyof typeof COLORS;
};

export default function DiagramContainer({ bulletPoints,children, svgLayout = "vertical", theme = "default" }: DiagramContainerProps) {

    if (svgLayout === "horizontal") {
        return <div className="flex flex-col p-4 gap-4 w-full items-center justify-center border min-h-[50vh] max-w-[50vw]">
            <div className="flex flex-row items-center justify-between gap-2">
                {
                    bulletPoints.map((point, index) => (
                        <div key={index} className="w-1/4">
                            <h3 className="font-medium" style={{ color: COLORS[theme][index % COLORS[theme].length] }}>{point.title}</h3>
                            <p className="text-xs text-gray-600">{point.content}</p>
                        </div>
                    ))
                }
            </div>
            {children}
        </div>
    }

    return (
        <div className="flex flex-row p-4 gap-4 w-full items-center justify-between border min-h-[50vh] max-w-[50vw]">
            <div className="flex flex-col items-end gap-8">
                {bulletPoints.slice(0, 2).map((point, index) => (
                    <div key={index} className="w-1/2">
                        <h3 className="font-medium" style={{ color: COLORS[theme][index % COLORS[theme].length] }}>{point.title}</h3>
                        <p className="text-xs text-gray-600">{point.content}</p>
                    </div>
                ))}
            </div>
            {children}
            <div className="flex flex-col justify-between items-start ml-8 gap-8">
                {
                    bulletPoints.slice(2).map((point, index) => (
                        <div key={index} className="w-1/2">
                            <h3 className="font-medium" style={{ color: COLORS[theme][index % COLORS[theme].length] }}>{point.title}</h3>
                            <p className="text-xs text-gray-600">{point.content}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}
