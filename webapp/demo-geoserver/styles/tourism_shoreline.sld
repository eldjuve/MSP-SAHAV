<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:Tourism_vs_Shoreline</Name>
        <UserStyle>
            <Name>tourism_shoreline</Name>
            <IsDefault>1</IsDefault>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name>Compatible</Name>
                    <Title>Compatible</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Shore_Tour</ogc:PropertyName>
                            <ogc:Literal>Compatible</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#1db70e</CssParameter>
                        </Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        </Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Conflict</Name>
                    <Title>Conflict</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Shore_Tour</ogc:PropertyName>
                            <ogc:Literal>Conflict</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#d45223</CssParameter>
                        </Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        </Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Irrelevant</Name>
                    <Title>Irrelevant</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Shore_Tour</ogc:PropertyName>
                            <ogc:Literal>Irrelevant</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#dbeb1a</CssParameter>
                        </Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        </Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Partial Compatible</Name>
                    <Title>Partial Compatible</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Shore_Tour</ogc:PropertyName>
                            <ogc:Literal>Partial Compatible</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#05eff3</CssParameter>
                        </Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        </Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <TextSymbolizer>
                        <Label>
                            <ogc:PropertyName>Shore_Tour</ogc:PropertyName>
                        </Label>
                        <Font>
                            <CssParameter name="font-family">Open Sans</CssParameter>
                            <CssParameter name="font-size">9</CssParameter>
                            <CssParameter name="font-style">normal</CssParameter>
                            <CssParameter name="font-weight">normal</CssParameter>
                        </Font>
                        <LabelPlacement>
                            <PointPlacement>
                                <AnchorPoint>
                                    <AnchorPointX>0</AnchorPointX>
                                    <AnchorPointY>0.5</AnchorPointY>
                                </AnchorPoint>
                            </PointPlacement>
                        </LabelPlacement>
                        <Fill>
                            <CssParameter name="fill">#323232</CssParameter>
                        </Fill>
                        <VendorOption name="maxDisplacement">1</VendorOption>
                    </TextSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
    </StyledLayerDescriptor>