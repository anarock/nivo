import React from 'react'
import { useTheme } from 'styled-components'
import { patternDotsDef, patternLinesDef, patternSquaresDef } from '@anarock/nivo-core'
import { ResponsiveBar } from '@anarock/nivo-bar'
import { ResponsiveStream } from '@anarock/nivo-stream'
import { ResponsiveTreeMap } from '@anarock/nivo-treemap'
import { generateCountriesData } from '@anarock/nivo-generators'
import { FullWidthBanner } from '../../styled'

export const PatternsIllustrations = () => {
    const theme = useTheme()

    return (
        <FullWidthBanner>
            <div className="guide__illustrations">
                <div className="guide__illustrations__item">
                    <ResponsiveStream
                        margin={{ top: -2, right: -2, bottom: -2, left: -2 }}
                        // @ts-ignore
                        data={generateCountriesData(['a', 'b', 'c'], { size: 7 })}
                        indexBy="country"
                        keys={['a', 'b', 'c']}
                        offsetType="expand"
                        axisLeft={null}
                        axisBottom={null}
                        enableGridX={false}
                        defs={[
                            patternLinesDef('example1.lines.1', {
                                rotation: 45,
                                lineWidth: 4,
                                spacing: 6,
                                background: 'transparent',
                                color: 'inherit',
                            }),
                            patternLinesDef('example1.lines.2', {
                                rotation: -45,
                                lineWidth: 1,
                                spacing: 3,
                                background: 'transparent',
                                color: 'inherit',
                            }),
                            patternDotsDef('example1.dots', {
                                background: 'transparent',
                                color: 'inherit',
                                size: 4,
                                padding: 0,
                                stagger: true,
                            }),
                        ]}
                        fill={[
                            { match: { id: 'a' }, id: 'example1.lines.1' },
                            { match: { id: 'b' }, id: 'example1.dots' },
                            { match: { id: 'c' }, id: 'example1.lines.2' },
                        ]}
                        borderWidth={2}
                        borderColor={'#333'}
                        isInteractive={false}
                        animate={false}
                        theme={theme.nivo}
                    />
                </div>
                <div className="guide__illustrations__item">
                    <ResponsiveBar
                        margin={{ top: 15, right: -2, bottom: -2, left: -2 }}
                        // @ts-ignore
                        data={generateCountriesData(['a', 'b', 'c'], { size: 7 })}
                        indexBy="country"
                        keys={['a', 'b', 'c']}
                        colors={{ scheme: 'spectral' }}
                        padding={0.3}
                        axisLeft={null}
                        axisBottom={null}
                        enableGridY={false}
                        enableLabel={false}
                        // @ts-ignore
                        colorBy="index"
                        defs={[
                            patternLinesDef('example2.lines', {
                                rotation: -45,
                                lineWidth: 4,
                                spacing: 6,
                                background: 'transparent',
                                color: 'inherit',
                            }),
                            patternDotsDef('example2.dots', {
                                background: 'transparent',
                                color: 'inherit',
                                size: 4,
                                padding: 0,
                                stagger: true,
                            }),
                            patternSquaresDef('example2.squares', {
                                background: 'transparent',
                                color: 'inherit',
                                stagger: true,
                                size: 8,
                                padding: 0,
                            }),
                        ]}
                        fill={[
                            { match: d => d.data.index % 3 === 0, id: 'example2.lines' },
                            { match: d => d.data.index % 3 === 1, id: 'example2.dots' },
                            { match: d => d.data.index % 3 === 2, id: 'example2.squares' },
                        ]}
                        borderWidth={2}
                        borderColor="inherit"
                        isInteractive={false}
                        animate={false}
                        theme={theme.nivo}
                    />
                </div>
                <div className="guide__illustrations__item">
                    <ResponsiveTreeMap
                        margin={{ top: -2, right: -2, bottom: -2, left: -2 }}
                        data={{
                            country: 'root',
                            children: generateCountriesData(['value'], { size: 9 }),
                        }}
                        identity="country"
                        leavesOnly={true}
                        colors={{ scheme: 'spectral' }}
                        colorBy="id"
                        borderWidth={4}
                        outerPadding={10}
                        innerPadding={4}
                        nodeOpacity={1}
                        borderColor="inherit"
                        isInteractive={false}
                        animate={false}
                        enableLabel={false}
                        enableParentLabel={false}
                        // @ts-ignore
                        defs={[
                            patternLinesDef('example3.lines', {
                                rotation: -45,
                                lineWidth: 4,
                                spacing: 6,
                                background: 'transparent',
                                color: 'inherit',
                            }),
                        ]}
                        fill={[{ match: '*', id: 'example3.lines' }]}
                        theme={theme.nivo}
                    />
                </div>
                <div className="guide__illustrations__legend">
                    patterns applied to various nivo components.
                </div>
            </div>
        </FullWidthBanner>
    )
}
