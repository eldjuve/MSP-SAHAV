<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:Geomorphology_Clipped</Name>
        <UserStyle>
            <Name>geomorph</Name>
            <IsDefault>1</IsDefault>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name>Abandoned Quarry</Name>
                    <Title>Abandoned Quarry</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Abandoned Quarry</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#8c61e2</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Beach</Name>
                    <Title>Beach</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Beach</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#dfe19d</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Beach Ridge</Name>
                    <Title>Beach Ridge</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Beach Ridge</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#d9d3a8</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Channel Bar</Name>
                    <Title>Channel Bar</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Channel Bar</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#e2ec2d</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Channel Island</Name>
                    <Title>Channel Island</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Channel Island</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#9ff6cb</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>CosOri - Older Deltaic Plain</Name>
                    <Title>CosOri - Older Deltaic Plain</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>CosOri - Older Deltaic Plain</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#c4c978</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Creek Network</Name>
                    <Title>Creek Network</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Creek Network</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#37708d</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>FluOri - Older Flood plain</Name>
                    <Title>FluOri - Older Flood plain</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>FluOri - Older Flood plain</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#b5c6a8</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Gullied Land</Name>
                    <Title>Gullied Land</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Gullied Land</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#d8bf8d</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Mangrove swamp</Name>
                    <Title>Mangrove swamp</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Mangrove swamp</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#7bcfcc</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Palaeo Distributary</Name>
                    <Title>Palaeo Distributary</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Palaeo Distributary</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#74e02c</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Pediment</Name>
                    <Title>Pediment</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Pediment</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#d3b64d</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Pediment-Corestone-Tor Composite</Name>
                    <Title>Pediment-Corestone-Tor Composite</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Pediment-Corestone-Tor Composite</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#5de371</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Pediplain</Name>
                    <Title>Pediplain</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Pediplain</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#e7da8d</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Plain (Lateritic)</Name>
                    <Title>Plain (Lateritic)</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Plain (Lateritic)</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#a3e395</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Swale</Name>
                    <Title>Swale</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Swale</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#a5674b</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Tidal Flat</Name>
                    <Title>Tidal Flat</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Tidal Flat</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#abe62d</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Tidal Inlet</Name>
                    <Title>Tidal Inlet</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Tidal Inlet</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#5982cd</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Upland (Lateritic)</Name>
                    <Title>Upland (Lateritic)</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>Upland (Lateritic)</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#d47756</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>WatBod - Others</Name>
                    <Title>WatBod - Others</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>WatBod - Others</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#76dbe3</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>WatBod - River</Name>
                    <Title>WatBod - River</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GEOMORPHOL</ogc:PropertyName>
                            <ogc:Literal>WatBod - River</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#70dae4</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
    </StyledLayerDescriptor>