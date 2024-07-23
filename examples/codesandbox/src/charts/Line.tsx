import { ResponsiveLine, ResponsiveLineCanvas } from '@anarock/nivo-line'
import { generateDrinkStats } from '@anarock/nivo-generators'
import { useChart } from '../hooks'

const props = {
  enableSlices: 'x',
  margin: { top: 20, right: 20, bottom: 60, left: 80 },
} as const

export function Line() {
  const [data, flavor] = useChart(() => generateDrinkStats(9))

  if (flavor === 'canvas') {
    return <ResponsiveLineCanvas data={data} {...props} />
  }

  return <ResponsiveLine data={data} {...props} />
}
