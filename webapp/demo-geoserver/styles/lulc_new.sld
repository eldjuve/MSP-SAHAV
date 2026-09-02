<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:LULC_Pondy</Name>
        <UserStyle>
            <Name>lulc_new</Name>
            <IsDefault>1</IsDefault>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name>Bare/Sparse vegetation</Name>
                    <Title>Bare/Sparse vegetation</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Class</ogc:PropertyName>
                            <ogc:Literal>Bare/Sparse vegetation</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#ffef95</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Built-up</Name>
                    <Title>Built-up</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Class</ogc:PropertyName>
                            <ogc:Literal>Built-up</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#cf4513</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Cropland</Name>
                    <Title>Cropland</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Class</ogc:PropertyName>
                            <ogc:Literal>Cropland</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#42ff6a</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Grassland</Name>
                    <Title>Grassland</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Class</ogc:PropertyName>
                            <ogc:Literal>Grassland</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#5ebc04</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Shrubland</Name>
                    <Title>Shrubland</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Class</ogc:PropertyName>
                            <ogc:Literal>Shrubland</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#c6e67f</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Tree Cover</Name>
                    <Title>Tree Cover</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Class</ogc:PropertyName>
                            <ogc:Literal>Tree Cover</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#0e7f05</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Water bodies</Name>
                    <Title>Water bodies</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Class</ogc:PropertyName>
                            <ogc:Literal>Water bodies</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#24e6ed</CssParameter>
                        <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Wetland</Name>
                    <Title>Wetland</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Class</ogc:PropertyName>
                            <ogc:Literal>Wetland</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#8e921d</CssParameter>
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