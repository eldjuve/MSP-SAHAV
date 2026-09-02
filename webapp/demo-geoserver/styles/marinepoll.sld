<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:Marine_Outfall</Name>
        <UserStyle>
            <Name>marinepoll</Name>
            <IsDefault>1</IsDefault>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name>Kalapet</Name>
                    <Title>Kalapet</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Station_Na</ogc:PropertyName>
                            <ogc:Literal>Kalapet</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PointSymbolizer>
                        <Graphic>
                            <Mark>
                                <WellKnownName>circle</WellKnownName>
                                <Fill>
                                    <CssParameter name="fill">#e66be6</CssParameter>
                                <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                                <Stroke>
                                    <CssParameter name="stroke">#232323</CssParameter>
                                    <CssParameter name="stroke-width">0.5</CssParameter>
                                <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                            </Mark>
                            <Size>13</Size>
                        </Graphic>
                    </PointSymbolizer>
                </Rule>
                <Rule>
                    <Name>Thengaithittu</Name>
                    <Title>Thengaithittu</Title>
                    <ogc:Filter>
                        <ogc:PropertyIsEqualTo>
                            <ogc:PropertyName>Station_Na</ogc:PropertyName>
                            <ogc:Literal>Thengaithittu</ogc:Literal>
                        </ogc:PropertyIsEqualTo>
                    </ogc:Filter>
                    <PointSymbolizer>
                        <Graphic>
                            <Mark>
                                <WellKnownName>circle</WellKnownName>
                                <Fill>
                                    <CssParameter name="fill">#da4426</CssParameter>
                                <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                                <Stroke>
                                    <CssParameter name="stroke">#232323</CssParameter>
                                    <CssParameter name="stroke-width">0.5</CssParameter>
                                <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                            </Mark>
                            <Size>13</Size>
                        </Graphic>
                    </PointSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
    </StyledLayerDescriptor>