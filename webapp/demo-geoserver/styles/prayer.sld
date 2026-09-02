<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:Religious_Place</Name>
        <UserStyle>
            <Name>prayer</Name>
            <IsDefault>1</IsDefault>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name>Single symbol</Name>
                    <PointSymbolizer>
                        <Graphic>
                            <Mark>
                                <WellKnownName>equilateral_triangle</WellKnownName>
                                <Fill>
                                    <CssParameter name="fill">#f72d00</CssParameter>
                                    <CssParameter name="fill-opacity">0</CssParameter>
                                </Fill>
                                <Stroke>
                                    <CssParameter name="stroke">#db0a00</CssParameter>
                                <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                            </Mark>
                            <Size>18</Size>
                        </Graphic>
                    </PointSymbolizer>
                    <PointSymbolizer>
                        <Graphic>
                            <Mark>
                                <WellKnownName>circle</WellKnownName>
                                <Fill>
                                    <CssParameter name="fill">#e41a00</CssParameter>
                                <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                                <Stroke>
                                    <CssParameter name="stroke">#e81b00</CssParameter>
                                    <CssParameter name="stroke-width">0.6</CssParameter>
                                <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                            </Mark>
                            <Size>3</Size>
                        </Graphic>
                    </PointSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
    </StyledLayerDescriptor>