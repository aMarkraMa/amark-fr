import { createMathPlugin } from "@streamdown/math";
import type { ComponentProps } from "react";
import remarkBreaks from "remark-breaks";
import { defaultRemarkPlugins, Streamdown } from "streamdown";
import "katex/dist/katex.min.css";
import "streamdown/styles.css";

const mathPlugin = createMathPlugin({
    singleDollarTextMath: true,
});

export function Markdown(props: ComponentProps<typeof Streamdown>) {
    const { remarkPlugins, plugins, mode = "static", ...rest } = props;
    const extra = remarkPlugins
        ? Array.isArray(remarkPlugins)
            ? remarkPlugins
            : [remarkPlugins]
        : [];

    const remarkPluginsMerged = [
        defaultRemarkPlugins.gfm,
        remarkBreaks,
        defaultRemarkPlugins.codeMeta,
        ...extra,
    ];

    return (
        <Streamdown
            mode={mode}
            remarkPlugins={remarkPluginsMerged}
            plugins={{ math: mathPlugin, ...plugins }}
            {...rest}
        />
    );
}
