<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:Tourism_Boating</Name>
        <UserStyle>
            <Name>boatingzone</Name>
            <IsDefault>1</IsDefault>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name>ARIANKUPPAM</Name>
                    <Title>ARIANKUPPAM</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>VNAME</ogc:PropertyName>
                            <ogc:Literal>ARIANKUPPAM</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <GraphicFill>
                                <Graphic>
                                    <Mark>
                                        <WellKnownName>horline</WellKnownName>
                                        <Stroke>
                                            <CssParameter name="stroke">#ddac43</CssParameter>
                                        </Stroke>
                                    </Mark>
                                </Graphic>
                            </GraphicFill>
                        </Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        </Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>POORANANKUPPAM</Name>
                    <Title>POORANANKUPPAM</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>VNAME</ogc:PropertyName>
                            <ogc:Literal>POORANANKUPPAM</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <GraphicFill>
                                <Graphic>
                                    <Mark>
                                        <WellKnownName>horline</WellKnownName>
                                        <Stroke>
                                            <CssParameter name="stroke">#1f1424</CssParameter>
                                        </Stroke>
                                    </Mark>
                                </Graphic>
                            </GraphicFill>
                        </Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        </Stroke>
                    </PolygonSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
    </StyledLayerDescriptor>