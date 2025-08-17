import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import { DIAGRAMS, type Diagram } from "../data/diagrams";
import COLORS from "../data/colors";

type RoughSVGRendererProps = React.SVGProps<SVGSVGElement> & {
    diagramId: string
    isRough?: boolean
    width?: number | string;
    roughStyle?: "hachure" | "solid" | "zigzag" | "cross-hatch" | "dots" | "dashed" | "zigzag-line";
    theme?: keyof typeof COLORS;
};

const _DEFAULT_VIEWBOX = '0 0 960 540';

function hexToRgba(hex:string, opacity:number) {
            // Remove # if present
            hex = hex.replace('#', '');
            
            // Parse hex values
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }

export default function DiagramRenderer({ diagramId, isRough = false, width, roughStyle = "solid", theme = "default",...rest }: RoughSVGRendererProps) {
    const [viewBox, setViewBox] = useState(_DEFAULT_VIEWBOX);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const groupRef = useRef<SVGGElement>(null);

    useEffect(() => {
        if (groupRef.current && svgRef.current) {
            const bbox = groupRef.current.getBBox();
            const padding = 10;
            const viewBoxString = `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + 2 * padding} ${bbox.height + 2 * padding}`;
            setViewBox(viewBoxString);
            
            if (isRough) {
                const rc = rough.svg(svgRef.current);
                const diagrams: Diagram[] = DIAGRAMS[diagramId];
                diagrams.forEach(({ path, options }) => {
                    if (groupRef.current) {
                        const fillColor = options.fill == 100 ? "#000000": options.fill == 101 ? "#ffffff" : COLORS[theme][options.fill] as string;
                        console.log(fillColor)
                        if(options.noRough){
                            groupRef.current.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
                            const pathElement = groupRef.current.lastChild as SVGPathElement;
                            pathElement.setAttribute("d", path);
                            Object.entries({ fill: fillColor, stroke: fillColor }).forEach(([key, value]) => {
                                pathElement.setAttribute(key, value as string);
                            });
                        }else{
                            if(options.fillOpacity){
                                const fillOpacity = +options.fillOpacity as number;
                                const fill = hexToRgba(fillColor, fillOpacity);
                                groupRef.current.appendChild(rc.path(path, { ...options, fill, stroke: fill, fillStyle: roughStyle }));
                            }else{
                                groupRef.current.appendChild(rc.path(path, { ...options,fill: fillColor,stroke: fillColor, fillStyle: roughStyle }));
                            }
                        }
                    }
                });
            }
        }
    }, [diagramId, isRough, roughStyle, theme]);

    return (
        <svg
            ref={svgRef}
            viewBox={viewBox}
            width={width || 500}
            fill="none"
            stroke="none"
            strokeLinecap="square"
            strokeMiterlimit={10}
            {...rest}
        >
            <g ref={groupRef}>
                { !isRough && DIAGRAMS[diagramId].map(({ path, options }, index) => {
                    const fillColor = options.fill == 100 ? "#000000": options.fill == 101 ? "#ffffff" : COLORS[theme][options.fill] as string;
                    return (
                        <path key={index} d={path} fill={fillColor} stroke={fillColor} />
                    );
                })}
            </g>
        </svg>
    );
}