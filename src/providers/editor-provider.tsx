import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";
import {
  createContext,
  CSSProperties,
  JSX,
  useCallback,
  useContext,
} from "react";
import { AlignType, CustomElementType } from "@/lib/utils";

// Define custom types for Slate
type CustomElement = {
  type: CustomElementType;
  align?: AlignType;
  link?: string;
  children: CustomText[];
};

type CustomText = {
  text: string;
  bold?: boolean;
  code?: boolean;
  italic?: boolean;
  underline?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// Custom Types for the Editor Context
interface EditorContextType {
  renderElement: (props: CustomElementProps) => JSX.Element;
  renderLeaf: (props: LeafProps) => JSX.Element;
  contentValue: Descendant[];
  changeContentValue: (value: Descendant[]) => void;
}

interface CustomElementProps {
  attributes: {
    "data-slate-node": "element";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  children: React.ReactNode;
  element: CustomElement;
}

const EditorContext = createContext<EditorContextType | null>(null);

const CustomElement = ({
  attributes,
  children,
  element,
}: CustomElementProps) => {
  const style: CSSProperties = {
    textAlign: element.align as CSSProperties["textAlign"],
  };

  if (element.type === "paragraph") {
    const text = element.children
      ?.map((child: CustomText) => child.text)
      .join("");
    const hasBoldText = element.children?.some(
      (child: CustomText) => child.bold,
    );

    if (hasBoldText) {
      const paragraphId = `paragraph-${text.toLowerCase().replace(/\s+/g, "-")}`;
      return (
        <p id={paragraphId} style={style} {...attributes}>
          {children}
        </p>
      );
    }
  }

  const headingText: string = element.children?.[0]?.text || "";
  const headingId: string = headingText.toLowerCase().replace(/\s+/g, "-");

  switch (element.type) {
    case "block-quote":
    case "block_quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "list-item":
    case "list_item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "heading-one":
    case "heading_one":
      return (
        <h1 id={headingId} style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
    case "heading_two":
      return (
        <h2 id={headingId} style={style} {...attributes}>
          {children}
        </h2>
      );
    case "bulleted_list":
    case "bulleted-list":
    case "ul_list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "numbered_list":
    case "numbered-list":
    case "ol_list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );

    case "link":
      return <a href={element.link}>{children}</a>;

    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

// const Image = ({
//   align,
//   attributes,
//   children,
//   element,
// }: {
//   align: string;
//   attributes: any;
//   children: React.ReactNode;
//   element: any;
// }) => {
//   const editor = useSlate();
//   const selected = useSelected();
//   const focused = useFocused();
//   const path = ReactEditor.findPath(editor, element);
//   const style = {
//     position: "relative",
//     marginLeft: align === undefined || align === "left" ? 0 : "auto",
//     marginRight: align === undefined || align === "right" ? 0 : "auto",
//   };

//   return (
//     <div {...attributes}>
//       {children}
//       <div className="image" contentEditable={false} style={style}>
//         <img
//           src={element.url}
//           style={{
//             boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
//           }}
//         />
//         <Button
//           variant="icon"
//           className="btn__icon__delete"
//           style={{ display: selected && focused ? "inline" : "none" }}
//           onMouseDown={() => Transforms.removeNodes(editor, { at: path })}
//         >
//           <MdDelete size={ICON_SIZE} />
//         </Button>
//       </div>
//     </div>
//   );
// };

interface LeafProps {
  attributes: {
    "data-slate-leaf": true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  children: React.ReactNode;
  leaf: {
    bold?: boolean;
    code?: boolean;
    italic?: boolean;
    underline?: boolean;
    text?: string;
  };
}

const Leaf: React.FC<LeafProps> = ({ attributes, leaf, children }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = (
      <code className="bg-muted rounded-md px-1.5 py-0.5">{children}</code>
    );
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

interface EditorProviderProps {
  contentValue: Descendant[];
  changeContentValue: (value: Descendant[]) => void;
  children: React.ReactNode;
}

const EditorProvider: React.FC<EditorProviderProps> = ({
  contentValue,
  changeContentValue,
  children,
}) => {
  const renderElement = useCallback((props: CustomElementProps) => {
    return <CustomElement {...props} />;
  }, []);

  const renderLeaf = useCallback((props: LeafProps) => {
    return <Leaf {...props} />;
  }, []);

  //   const changeContentValue = (value: Descendant[] = initialValue) => {
  //     changeContentValue(value);
  //     const content = JSON.stringify(value);
  //   };

  return (
    <EditorContext.Provider
      value={{ renderElement, renderLeaf, contentValue, changeContentValue }}
    >
      {children}
    </EditorContext.Provider>
  );
};

const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return context;
};

export default EditorProvider;
export { useEditor };
export type { CustomElement, CustomText, EditorContextType };
