<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:WaterQuality_Buoy</Name>
        <UserStyle>
            <Name>buoy</Name>
            <IsDefault>1</IsDefault>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name>Single symbol</Name>
                    <PointSymbolizer>
                        <Graphic>
                            <ExternalGraphic>
                                <OnlineResource xlink:type="simple" xlink:href="buoy.png" />
                                <Format>image/png</Format>
                            </ExternalGraphic>
                            <!-- Fallback for clients that can't render the external
                                 graphic (e.g. GetLegendGraphic, which NPEs without a
                                 Mark sibling to fall back to — see bank.sld). -->
                            <Mark>
                                <Fill>
                                    <CssParameter name="fill">#e8590c</CssParameter>
                                <CssParameter name="fill-opacity">0.7</CssParameter></Fill>
                                <Stroke>
                                    <CssParameter name="stroke">#c92a2a</CssParameter>
                                    <CssParameter name="stroke-width">2</CssParameter>
                                <CssParameter name="stroke-opacity">1</CssParameter></Stroke>
                            </Mark>
                            <Size>36</Size>
                        </Graphic>
                    </PointSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
    </StyledLayerDescriptor>
