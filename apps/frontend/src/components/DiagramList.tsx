import { ForwardRefExoticComponent, ReactNode, RefAttributes, useEffect, useState } from "react";
import type { DiagramData } from "../tools/DiagramInlineTool";
import DiagramContainer from "./DiagramContainer";
import DiagramRenderer from "./DiagramRenderer";
import { BulletPointsResponseSchema } from "../schema";
import { experimental_useObject } from "@ai-sdk/react";
import COLORS from "../data/colors";
import { ChevronDown, Grid, LucideProps, Palette, Settings } from "lucide-react";



export default function DiagramList({ data }: { data: DiagramData }) {
    const [diagramId, setDiagramId] = useState('stacked');
    const [selectedColor, setSelectedColor] = useState<keyof typeof COLORS>('default');
    const [isRough, setIsRough] = useState(false);
    const [roughStyle, setRoughStyle] = useState<('hachure' | 'solid' | 'zigzag' | 'cross-hatch' | 'dots' | 'dashed')>('hachure');

    const { object, submit } = experimental_useObject({
        api: 'http://localhost:3001/api/ai/structured',
        schema: BulletPointsResponseSchema
    });

    useEffect(() => {
        if (data) {
            submit({ context: data.originalText });
        }
    }, [data]);

    const SelectWrapper = ({ children, icon: Icon, label }: { children: ReactNode; icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>; label: string }) => (
        <div className="relative group">
            <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                {Icon && <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors" />}
                <div className="flex-1 relative">
                    {children}
                    <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>
            {label && (
                <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-slate-600 font-medium">
                    {label}
                </span>
            )}
        </div>
    );

    const CheckboxWrapper = ({ children, label }: { children: ReactNode; label: string }) => (
        <div className="relative">
            <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                <label className="flex items-center space-x-3 cursor-pointer">
                    {children}
                    <span className="text-sm font-medium text-slate-700 select-none">{label}</span>
                </label>
            </div>
        </div>
    );

    return (
        <div className=" min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Settings className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-800">Diagram Controls</h2>
                    </div>

                    <div className="flex items-center space-x-4 mb-6">
                        <SelectWrapper icon={Grid} label="Diagram Type">
                            <select
                                value={diagramId}
                                onChange={(e) => setDiagramId(e.target.value)}
                                className="w-full bg-transparent outline-none text-sm font-medium text-slate-700 cursor-pointer pr-6 appearance-none"
                            >
                                <option value="stacked">Stacked</option>
                                <option value="arrow">Arrow</option>
                                <option value="diamond">Diamond</option>
                                <option value="puzzle">Puzzle</option>
                                <option value="radial">Radial</option>
                                <option value="pinwheel">Pinwheel</option>
                                <option value="eight">Eight</option>
                                <option value="pyramid">Pyramid</option>
                            </select>
                        </SelectWrapper>

                        <SelectWrapper icon={Palette} label="Color Theme">
                            <select
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value as keyof typeof COLORS)}
                                className="w-full bg-transparent outline-none text-sm font-medium text-slate-700 cursor-pointer pr-6 appearance-none"
                            >
                                {Object.keys(COLORS).map((color) => (
                                    <option key={color} value={color}>
                                        {color.charAt(0).toUpperCase() + color.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </SelectWrapper>

                        <CheckboxWrapper label="Rough Style">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={isRough}
                                    onChange={(e) => setIsRough(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${isRough ? 'bg-blue-500' : 'bg-slate-200'
                                    }`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 transform ${isRough ? 'translate-x-5' : 'translate-x-0.5'
                                        } translate-y-0.5`}></div>
                                </div>
                            </div>
                        </CheckboxWrapper>

                        <SelectWrapper icon={Settings} label="Style Pattern">
                            <select
                                value={roughStyle}
                                onChange={(e) => setRoughStyle(e.target.value as ('hachure' | 'solid' | 'zigzag' | 'cross-hatch' | 'dots' | 'dashed'))}
                                className="w-full bg-transparent outline-none text-sm font-medium text-slate-700 cursor-pointer pr-6 appearance-none"
                                disabled={!isRough}
                            >
                                <option value="hachure">Hachure</option>
                                <option value="solid">Solid</option>
                                <option value="zigzag">Zigzag</option>
                                <option value="cross-hatch">Cross Hatch</option>
                                <option value="dots">Dots</option>
                                <option value="dashed">Dashed</option>
                                <option value="zigzag-line">Zigzag Line</option>
                            </select>
                        </SelectWrapper>
                    </div>

                    {/* Preview Section */}
                    <div className="border-t border-slate-200 pt-6">
                        {object && object.bulletPoints && <DiagramContainer theme={selectedColor} bulletPoints={object.bulletPoints.map(point => ({ title: point?.title || "", content: point?.content || "" }))}>
                            <DiagramRenderer diagramId={diagramId} isRough={isRough} width={500} theme={selectedColor} roughStyle={roughStyle} />
                        </DiagramContainer>}
                    </div>
                </div>
            </div>
        </div>
    );
}