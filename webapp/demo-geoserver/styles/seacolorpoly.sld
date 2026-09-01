<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:Coast_Guard_Limits</Name>
        <UserStyle>
            <Name>seacolorpoly</Name>
            <IsDefault>1</IsDefault>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name>Coast Guard Security Group Zone</Name>
                    <Title>Coast Guard Security Group Zone</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GeoName</ogc:PropertyName>
                            <ogc:Literal>Coast Guard Security Group Zone</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#5287eb</CssParameter>
                        </Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        </Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Coast Guard Zone</Name>
                    <Title>Coast Guard Zone</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GeoName</ogc:PropertyName>
                            <ogc:Literal>Coast Guard Zone</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#d24a65</CssParameter>
                        </Fill>
                        <Stroke>
                            <CssParameter name="stroke">#232323</CssParameter>
                            <CssParameter name="stroke-linejoin">bevel</CssParameter>
                        </Stroke>
                    </PolygonSymbolizer>
                </Rule>
                <Rule>
                    <Name>Naval Ships Zone</Name>
                    <Title>Naval Ships Zone</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>GeoName</ogc:PropertyName>
                            <ogc:Literal>Naval Ships Zone</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PolygonSymbolizer>
                        <Fill>
                            <CssParameter name="fill">#5dc95e</CssParameter>
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