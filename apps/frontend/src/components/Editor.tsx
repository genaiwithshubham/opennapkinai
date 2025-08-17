import { memo, useEffect, useRef } from "react";
import EditorJS, { type API, type BlockMutationEvent, type OutputData } from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import DiagramInlineTool from "../tools/DiagramInlineTool";
import { DiagramBlockTool } from "../tools/DiagramBlockTool";


const EDITOR_JS_TOOLS = {
    paragraph: {
        class: Paragraph,
        inlineToolbar: ["diagram"],
    },
    header: Header,
    diagram: DiagramInlineTool,
    diagramBlock: DiagramBlockTool,
};

type EditorProps = {
    data: OutputData | undefined;
    onChange: (data: OutputData) => void;
    editorblock: string;
};

const Editor = ({ data, onChange, editorblock }: EditorProps) => {
    const ref = useRef<EditorJS | null>(null);
    //Initialize editorjs
    useEffect(() => {
        //Initialize editorjs if we don't have a reference
        if (!ref.current) {
            const editor = new EditorJS({
                holder: editorblock,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                tools: EDITOR_JS_TOOLS,
                data: data,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                async onChange(api: API, event: BlockMutationEvent | BlockMutationEvent[]) {
                    const data = await api.saver.save();
                    onChange(data);
                },
            });
            ref.current = editor;
        }

        //Add a return function to handle cleanup
        return () => {
            if (ref.current && ref.current.destroy) {
                ref.current.destroy();
            }
        };
    }, []);
    return <div id={editorblock} />;
};

export default memo(Editor);