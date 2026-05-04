import type { ComponentProps } from "react";
import remarkBreaks from "remark-breaks";
import { defaultRemarkPlugins, Streamdown } from "streamdown";
import "streamdown/styles.css";

export function Markdown(props: ComponentProps<typeof Streamdown>) {
    const { remarkPlugins, ...rest } = props;
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

    return <Streamdown remarkPlugins={remarkPluginsMerged} {...rest} />;
}
