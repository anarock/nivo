import { useEffect, useMemo, useRef, createElement } from 'react'
import { Container, useDimensions, useTheme } from '@anarock/nivo-core'
import { setCanvasFont } from '@anarock/nivo-text'
import { useMesh, renderDebugToCanvas } from '@anarock/nivo-voronoi'
import { DefaultDatum, TreeCanvasProps, CustomCanvasLayerProps, ComputedNode } from './types'
import { canvasDefaultProps } from './defaults'
import { useTree } from './hooks'
import { useLabels } from './labelsHooks'

type InnerTreeCanvasProps<Datum> = Omit<
    TreeCanvasProps<Datum>,
    'animate' | 'motionConfig' | 'renderWrapper' | 'theme'
>

const InnerTreeCanvas = <Datum,>({
    width,
    height,
    pixelRatio = canvasDefaultProps.pixelRatio,
    margin: partialMargin,
    data,
    identity,
    mode = canvasDefaultProps.mode,
    layout = canvasDefaultProps.layout,
    nodeSize = canvasDefaultProps.nodeSize,
    activeNodeSize,
    inactiveNodeSize,
    nodeColor = canvasDefaultProps.nodeColor,
    fixNodeColorAtDepth = canvasDefaultProps.fixNodeColorAtDepth,
    renderNode = canvasDefaultProps.renderNode,
    linkCurve = canvasDefaultProps.linkCurve,
    linkThickness = canvasDefaultProps.linkThickness,
    activeLinkThickness,
    inactiveLinkThickness,
    linkColor = canvasDefaultProps.linkColor,
    renderLink = canvasDefaultProps.renderLink,
    enableLabel = canvasDefaultProps.enableLabel,
    label = canvasDefaultProps.label,
    labelsPosition = canvasDefaultProps.labelsPosition,
    orientLabel = canvasDefaultProps.orientLabel,
    labelOffset = canvasDefaultProps.labelOffset,
    renderLabel = canvasDefaultProps.renderLabel,
    layers = canvasDefaultProps.layers,
    isInteractive = canvasDefaultProps.isInteractive,
    meshDetectionRadius = canvasDefaultProps.meshDetectionRadius,
    debugMesh = canvasDefaultProps.debugMesh,
    highlightAncestorNodes = canvasDefaultProps.highlightAncestorNodes,
    highlightDescendantNodes = canvasDefaultProps.highlightDescendantNodes,
    highlightAncestorLinks = canvasDefaultProps.highlightAncestorLinks,
    highlightDescendantLinks = canvasDefaultProps.highlightDescendantLinks,
    onNodeMouseEnter,
    onNodeMouseMove,
    onNodeMouseLeave,
    onNodeClick,
    nodeTooltip,
    nodeTooltipPosition = canvasDefaultProps.nodeTooltipPosition,
    nodeTooltipAnchor = canvasDefaultProps.nodeTooltipAnchor,
    role = canvasDefaultProps.role,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
}: InnerTreeCanvasProps<Datum>) => {
    const canvasEl = useRef<HTMLCanvasElement | null>(null)

    const { outerWidth, outerHeight, margin, innerWidth, innerHeight } = useDimensions(
        width,
        height,
        partialMargin
    )

    const theme = useTheme()

    const { nodes, nodeByUid, links, linkGenerator, setCurrentNode } = useTree<Datum>({
        data,
        identity,
        layout,
        mode,
        width: innerWidth,
        height: innerHeight,
        nodeSize,
        activeNodeSize,
        inactiveNodeSize,
        nodeColor,
        fixNodeColorAtDepth,
        highlightAncestorNodes,
        highlightDescendantNodes,
        linkCurve,
        linkThickness,
        activeLinkThickness,
        inactiveLinkThickness,
        linkColor,
        highlightAncestorLinks,
        highlightDescendantLinks,
    })

    const labels = useLabels<Datum>({
        nodes,
        label,
        layout,
        labelsPosition,
        orientLabel,
        labelOffset,
    })

    const renderTooltip = useMemo(() => {
        if (!nodeTooltip) return undefined
        return (node: ComputedNode<Datum>) => createElement(nodeTooltip, { node })
    }, [nodeTooltip])

    const {
        delaunay,
        voronoi,
        handleMouseEnter,
        handleMouseMove,
        handleMouseLeave,
        handleClick,
        current,
    } = useMesh<ComputedNode<Datum>, HTMLCanvasElement>({
        elementRef: canvasEl,
        nodes,
        width: innerWidth,
        height: innerHeight,
        margin,
        detectionRadius: meshDetectionRadius,
        isInteractive,
        setCurrent: setCurrentNode,
        onMouseEnter: onNodeMouseEnter,
        onMouseMove: onNodeMouseMove,
        onMouseLeave: onNodeMouseLeave,
        onClick: onNodeClick,
        tooltip: renderTooltip,
        tooltipPosition: nodeTooltipPosition,
        tooltipAnchor: nodeTooltipAnchor,
        debug: debugMesh,
    })

    const customLayerProps: CustomCanvasLayerProps<Datum> = useMemo(
        () => ({
            nodes,
            nodeByUid,
            links,
            innerWidth,
            innerHeight,
            linkGenerator,
        }),
        [nodes, nodeByUid, links, innerWidth, innerHeight, linkGenerator]
    )

    useEffect(() => {
        if (canvasEl.current === null) return

        canvasEl.current.width = outerWidth * pixelRatio
        canvasEl.current.height = outerHeight * pixelRatio

        const ctx = canvasEl.current.getContext('2d')!

        ctx.scale(pixelRatio, pixelRatio)

        ctx.fillStyle = theme.background
        ctx.fillRect(0, 0, outerWidth, outerHeight)

        ctx.translate(margin.left, margin.top)

        layers.forEach(layer => {
            if (layer === 'links') {
                linkGenerator.context(ctx)

                links.forEach(link => {
                    renderLink(ctx, { link, linkGenerator })
                })
            } else if (layer === 'nodes') {
                nodes.forEach(node => {
                    renderNode(ctx, { node })
                })
            } else if (layer === 'labels' && enableLabel) {
                setCanvasFont(ctx, theme.labels.text)

                labels.forEach(label => {
                    renderLabel(ctx, { label, theme })
                })
            } else if (layer === 'mesh' && debugMesh && voronoi) {
                ctx.save()
                // The mesh should cover the whole chart, including margins.
                ctx.translate(-margin.left, -margin.top)

                renderDebugToCanvas(ctx, {
                    delaunay,
                    voronoi,
                    detectionRadius: meshDetectionRadius,
                    index: current !== null ? current[0] : null,
                })

                ctx.restore()
            } else if (typeof layer === 'function') {
                layer(ctx, customLayerProps)
            }
        })
    }, [
        canvasEl,
        outerWidth,
        outerHeight,
        pixelRatio,
        margin.left,
        margin.top,
        theme,
        layers,
        nodes,
        nodeByUid,
        renderNode,
        links,
        renderLink,
        linkGenerator,
        labels,
        enableLabel,
        renderLabel,
        delaunay,
        voronoi,
        meshDetectionRadius,
        debugMesh,
        current,
        customLayerProps,
    ])

    return (
        <canvas
            ref={canvasEl}
            width={outerWidth * pixelRatio}
            height={outerHeight * pixelRatio}
            style={{
                width: outerWidth,
                height: outerHeight,
                cursor: isInteractive ? 'auto' : 'normal',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            role={role}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
        />
    )
}

export const TreeCanvas = <Datum = DefaultDatum,>({
    isInteractive = canvasDefaultProps.isInteractive,
    animate = canvasDefaultProps.animate,
    motionConfig = canvasDefaultProps.motionConfig,
    theme,
    renderWrapper,
    ...otherProps
}: TreeCanvasProps<Datum>) => (
    <Container
        {...{
            animate,
            isInteractive,
            motionConfig,
            renderWrapper,
            theme,
        }}
    >
        <InnerTreeCanvas<Datum> isInteractive={isInteractive} {...otherProps} />
    </Container>
)
