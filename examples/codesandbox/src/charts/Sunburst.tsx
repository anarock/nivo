import { ResponsiveSunburst } from '@anarock/nivo-sunburst'
import { generateLibTree } from '@anarock/nivo-generators'
import { useChart } from '../hooks'

const props = {
  id: 'name',
  value: 'loc',
}

export function Sunburst() {
  const [data] = useChart(generateLibTree)

  return <ResponsiveSunburst data={data} {...props} />
}
