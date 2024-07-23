import { PropertyAccessor } from '@anarock/nivo-core'
import { InheritedColorConfig } from '@anarock/nivo-colors'
import { ArcLabelComponent } from './ArcLabelsLayer'
import { DatumWithArcAndColor } from '../types'

export interface ArcLabelsProps<Datum extends DatumWithArcAndColor> {
    arcLabel: PropertyAccessor<Datum, string>
    arcLabelsRadiusOffset: number
    arcLabelsSkipAngle: number
    arcLabelsTextColor: InheritedColorConfig<Datum>
    arcLabelsComponent: ArcLabelComponent<Datum>
}
