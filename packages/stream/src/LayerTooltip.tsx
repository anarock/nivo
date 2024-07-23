import { BasicTooltip } from '@anarock/nivo-tooltip'
import { TooltipProps } from './types'

export const LayerTooltip = ({ layer }: TooltipProps) => (
    <BasicTooltip id={layer.label} enableChip={true} color={layer.color} />
)
